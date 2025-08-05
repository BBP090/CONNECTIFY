const express = require("express");
const bodyParser = require("body-parser");
const db = require('./database');

const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());

const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Listen for connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join a specific chat room
  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
  });


  // to update a specific user's request page:
  socket.on("receiveTexts", (userId) => {
    socket.join(userId);
  });

  socket.on("deleteMessage", async ({ messageId, chatId }) => {
    await db.promise().query(
      "DELETE FROM messages WHERE id = ? AND chat_id = ?",
      [messageId, chatId]
    );
    io.to(chatId).emit("messageDeleted", { messageId });

  });


  // Listen for messages and emit to room
  socket.on("sendMessage", async (message) => {
    // Save message to DB here:
    const [result] = await db.promise().query(
      "INSERT INTO messages (chat_id, sender_id, message_type, message, image_url, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
      [
        message.chatId,
        message.senderId,
        message.messageType,
        message.message,
        message.imageUrl,
        new Date(message.timeStamp),
      ]
    );

    const insertedMessageId = result.insertId;  // <-- This is the new message's ID


    await db.promise().query(
      `UPDATE ongoing_chats SET last_message1=CASE WHEN user2_id=? THEN ? ELSE last_message1 END,last_message2=CASE WHEN user1_id=? THEN ? ELSE last_message2 END WHERE id=?
`,
      [
        message.senderId,
        //message.messageType === "text" ? message.message : "Image.jpg",
        insertedMessageId,
        message.senderId,
        insertedMessageId,
        // message.messageType === "text" ? message.message : "Image.jpg",
        message.chatId,
      ]
    );


    // ✅ Broadcast the message to everyone in the room, including sender
    io.to(message.chatId).emit("receiveMessage", {
      ...message,
      timestamp: message.timeStamp,  // backend may overwrite this
      sender_id: message.senderId,
      message_type: message.messageType,
      message: message.message,
      image_url: message.imageUrl,
    });



    io.to(message.senderId).emit("chat_updated", { userId: message.senderId });
    io.to(message.receiverId).emit("chat_updated", {
      userId: message.receiverId
    });

  });



  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


server.listen(port, () => {
  console.log(` Server + Socket.IO running on http://localhost:${port}`);
});


app.post('/get-user-id', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const query = 'SELECT id FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      res.status(200).json({ id: results[0].id });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

app.post('/api/add-user-during-signup', (req, res) => {
  const { email } = req.body;
  console.log('email', email);
  if (!email) return res.status(400).json({ error: 'Email required' });

  const addUserQuery = `INSERT INTO users(email) VALUES (?);`
  db.query(addUserQuery, [email], (err, result) => {
    console.log('error adding user during signup', err);
    if (err) return res.status(500).json({ error: err.message });

    console.log(result);
    return res.status(200).json({ message: 'user added' });
  });
});

app.post('/api/add-user', (req, res) => {
  console.log("📥 Incoming request to /api/add-user with body:", req.body);
  const { email } = req.body;
  console.log(email);
  if (!email) return res.status(400).json({ error: 'Email required' });

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    console.log("Started checking for exisitng user.");

    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: err })
    }

    if (results.length === 0) {
      db.query('INSERT INTO users (email) VALUES (?)', [email], (err2, result) => {
        if (err2) return res.status(500).json({ error: err2 });
        if (!err2) {
          console.log("Inserted.");
          console.log(result.insertId);
          return res.status(200).json({ success: true, userId: result.insertId });
        }

        console.log("Query results:", results.length, "users found");

      });
    } else {
      console.log("Already existing user.")
      res.status(200).json({ message: 'User already exists.' });
    }
  });
});



app.get("/users", (req, res) => {
  db.query("SELECT id, name, profile_image, email FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/requests/send", (req, res) => {
  const { from_user_id, to_user_id } = req.body;
  console.log('from user:', from_user_id);
  console.log('to user:', to_user_id);
  const message = "Hey! I'd like to chat with you.";

  const checkQuery = `
    SELECT * FROM message_requests 
    WHERE from_user_id = ? AND to_user_id = ? AND status IN ('sent', 'accepted')
  `;

  db.query(checkQuery, [from_user_id, to_user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    console.log('error: ', err)

    if (results.length > 0) {
      console.log('requests: ', results);
      return res.status(400).json({ error: "Request already sent or accepted." });
    }

    const insertQuery = `
      INSERT INTO message_requests (from_user_id, to_user_id, message)
      VALUES (?, ?, ?)
    `;

    db.query(insertQuery, [from_user_id, to_user_id, message], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ success: true });
    });
  });
});

// GET message requests
app.get('/requests/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query(

    'select message_requests.id AS id, message_requests.message, message_requests.timestamp, users.id AS userId, users.name, users.profile_image from message_requests inner join users on message_requests.to_user_id= users.id where message_requests.to_user_id= ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// geet ongoing chat history.
app.get('/ongoing_messages/:userId', (req, res) => {
  const userId = req.params.userId;
  // chalirako query
  //SELECT ongoing_chats.id AS id, ongoing_chats.started_at as timestamp ,ongoing_chats.last_message as message, users.id AS userId, users.name, users.profile_image AS image FROM ongoing_chats INNER JOIN users ON ongoing_chats.user2_id = users.id WHERE ongoing_chats.user2_id = ?

  //Select ongoing_chats.id AS id, ongoing_chats.started_at as timestamp ,ongoing_chats.last_message as message from ongoing_chats where ongoing_chats.user1_id= ? or ongoing_chats.user2_id= ?

  //

  //Select ongoing_chats.id AS id, ongoing_chats.started_at as timestamp ,ongoing_chats.last_message as message from ongoing_chats where user1_id= ? OR user2_id= ?

  //SELECT ongoing_chats.id AS id, messages.message AS message, messages.timestamp AS timestamp, users.id AS userId, users.name, users.profile_image FROM ongoing_chats INNER JOIN users ON (users.id = ongoing_chats.user1_id AND ongoing_chats.user2_id = ?) OR (users.id = ongoing_chats.user2_id AND ongoing_chats.user1_id = ?) LEFT JOIN messages ON messages.id = CASE WHEN ongoing_chats.user1_id = ? THEN ongoing_chats.last_message1 WHEN ongoing_chats.user2_id = ? THEN ongoing_chats.last_message2 ELSE NULL END


  //SELECT ongoing_chats.id AS id,ongoing_chats.started_at AS timestamp,CASE WHEN ongoing_chats.user1_id=? THEN ongoing_chats.last_message1 WHEN ongoing_chats.user2_id=? THEN ongoing_chats.last_message2 ELSE NULL END AS message,users.id AS userId,users.name,users.profile_image  FROM ongoing_chats INNER JOIN users ON (users.id=ongoing_chats.user1_id AND ongoing_chats.user2_id=?) OR (users.id=ongoing_chats.user2_id AND ongoing_chats.user1_id=?)

  //SELECT ongoing_chats.id AS id, IFNULL(messages.message,'You accepted the message request') AS message, IFNULL(messages.timestamp,ongoing_chats.started_at) AS timestamp, users.id AS userId, users.name, users.profile_image FROM ongoing_chats INNER JOIN users ON (users.id=ongoing_chats.user1_id AND ongoing_chats.user2_id=?) OR (users.id=ongoing_chats.user2_id AND ongoing_chats.user1_id=?) LEFT JOIN messages ON messages.id=IF(ongoing_chats.user1_id=?, ongoing_chats.last_message1, ongoing_chats.last_message2)

  //SELECT ongoing_chats.id AS id, messages.message AS message, messages.timestamp AS timestamp, users.id AS userId, users.name, users.profile_image FROM ongoing_chats INNER JOIN users ON (users.id = ongoing_chats.user1_id AND ongoing_chats.user2_id = ?) OR (users.id = ongoing_chats.user2_id AND ongoing_chats.user1_id = ?) LEFT JOIN messages ON messages.id = CASE WHEN ongoing_chats.user1_id = ? THEN ongoing_chats.last_message1 WHEN ongoing_chats.user2_id = ? THEN ongoing_chats.last_message2 ELSE NULL END

  db.query(
    `SELECT ongoing_chats.id AS id, messages.message AS message, IFNULL(messages.timestamp,ongoing_chats.started_at) AS timestamp, users.id AS userId, users.name, users.profile_image FROM ongoing_chats INNER JOIN users ON (users.id=ongoing_chats.user1_id AND ongoing_chats.user2_id=?) OR (users.id=ongoing_chats.user2_id AND ongoing_chats.user1_id=?) LEFT JOIN messages ON messages.id=IF(ongoing_chats.user1_id=?, ongoing_chats.last_message1, ongoing_chats.last_message2)


`, [userId, userId, userId],
    (err, results) => {
      console.log('error for ongoing_messages2:', err);
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// POST accept request
app.post('/requests/accept', (req, res) => {
  const { requestId } = req.body;

  db.query('SELECT * FROM message_requests WHERE id = ?', [requestId], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: 'Request not found' });

    const { from_user_id, to_user_id } = result[0];

    db.query(
      'INSERT INTO ongoing_chats (user1_id, user2_id, started_at) VALUES (?, ?, NOW())',
      [from_user_id, to_user_id],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });

        db.query('DELETE FROM message_requests WHERE id = ?', [requestId]);
        res.json({ success: true });
      }
    );
  });
});

// POST reject request
app.post('/requests/reject', (req, res) => {
  const { requestId } = req.body;

  db.query('DELETE FROM message_requests WHERE id = ?', [requestId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// GET messages for a chat
app.get('/chat/:chatId/messages', (req, res) => {
  const chatId = req.params.chatId;

  db.query(
    'SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC',
    [chatId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// POST a new message
app.post('/chat/:chatId/message', (req, res) => {
  const { sender_id, message, message_type, image_url } = req.body;
  const chatId = req.params.chatId;

  db.query(
    'INSERT INTO messages (chat_id, sender_id, message, message_type, image_url, timestamp) VALUES (?, ?, ?, ?, ?, NOW())',
    [chatId, sender_id, message, message_type, image_url || null],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.get('/chat/:chatId/recipientId', (req, res) => {
  const chatId = req.params.chatId;

  db.query(
    'select * from ongoing_chats where id= ?', [chatId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'Chat not found' });
      res.json(results[0]);
    }
  );
});

// dleete entrie chats:
app.delete("/delete_chat/:chatId", (req, res) => {
  const chatId = req.params.chatId;
  // delete from DB...
  db.query("DELETE FROM ongoing_chats WHERE id = ?", [chatId], (err) => {
    if (err) return res.status(500).send("Failed");
    res.sendStatus(200);
  });
});

// API endpoint to handle user preferences
app.post("/api/user/preferences", (req, res) => {
  const { userId, preferences } = req.body;

  const values = preferences.map((element) => [userId, element]);

  if (!userId || !preferences) {
    return res.status(400).json({ error: "User ID and preferences are required." });
  }

  // Insert preferences into the preferences table
  const query = "INSERT INTO preferences (user_id, preference) VALUES ?";
  db.query(query, [values], (err, result) => {
    if (err) {
      console.error("Error inserting preferences:", err);
      return res.status(500).json({ error: "Failed to save preferences" });
    }
    res.status(200).json({ success: true, message: "Preferences saved successfully" });
    console.log(result);
  });
});


app.post('/api/get-user-profile', (req, res) => {
  const userId = req.body.userId;
  const tags = req.body.tags;

  console.log('tags:', tags);

  if (!userId && !tags)
    return res.status(500).jsom({ error: 'userId and Tags are required!!!!' });

  if (tags && tags.length) {
    const placeholders = tags.map(() => '?').join(','); // ?, ?, ?
    const retrieveUserQuery = `SELECT DISTINCT u.id AS userId, u.email FROM preferences p JOIN users u ON p.user_id = u.id WHERE p.preference IN (${placeholders}) AND u.id != ?;`;

    db.query(retrieveUserQuery, [...tags, userId], (err, result) => {
      if (err) {
        console.error('error:', err);
        return res.status(500).json({ error: 'Failed to retrieve user profile by tags.' });
      }

      console.log("Query results:", result.length, "users profiles that match the tag found.");

      if (result.length === 0) {
        return res.status(200).json({ message: 'No user profiles matching the tags.' })
      } else {
        console.log("User profiles retrieved matching the tags:", result);
        res.status(200).json({ message: 'User Profiles Retrieved by Tags', result });
      }
    });
  } else {
    const retrieveAll = `SELECT id, email FROM users where id != ?;`;
    const retrieveUserQuery = `SELECT DISTINCT 
  u.id AS userId,
  u.email
FROM 
  preferences p
JOIN 
  users u ON p.user_id = u.id
WHERE 
  p.preference IN (
    SELECT preference 
    FROM preferences 
    WHERE user_id = ?
  )
  AND u.id != ?
  AND u.id NOT IN (
    SELECT to_user_id 
    FROM message_requests 
    WHERE from_user_id = ? AND status = 'sent'
  )
  AND u.id NOT IN (
    SELECT 
      CASE 
        WHEN user1_id = ? THEN user2_id
        WHEN user2_id = ? THEN user1_id
      END
    FROM ongoing_chats
    WHERE user1_id = ? OR user2_id = ?
  );`;

    //     const retrieveUserQuery = `SELECT DISTINCT
    //   u.id AS userId, 
    //   u.email
    // FROM
    //   preferences p 
    // JOIN 
    //   users u ON p.user_id = u.id 
    // WHERE 
    //   (
    //     p.preference IN (
    //       SELECT preference 
    //       FROM preferences 
    //       WHERE user_id = ?
    //       )
    //   )
    //   AND u.id != ?;`
    db.query(retrieveUserQuery, [userId, userId, userId, userId, userId, userId, userId], (err, result) => {
      if (err) {
        console.error('error:', err);
        return res.status(500).json({ error: 'Failed to retrieve user profile.' });
      }

      console.log("Query results:", result.length, "users profiles found");

      // if (result.length === 0) {
      //   db.query(retrieveAll, [userId], (err, result) => {
      //     if (err) {
      //       console.error('error:', err);
      //       return res.status(500).json({ error: 'Failed to retrieve user profile.' });
      //     }
      //     console.log("Query results:", result.length, "users profiles found (when no preferences selected)");
      //     return res.status(200).json({ message: 'All users profiles retrieved (when no preferences selected)', result })
      //   })

      // } else {
      console.log("User Profiles Retrieved:", result);
      res.status(200).json({ message: 'User Profiles Retrieved', result });
      // }
    });
  }
});

app.get('/api/get-tags', (req, res) => {
  const retrieveTags = `SELECT DISTINCT preference from preferences;`;
  db.query(retrieveTags, (err, result) => {
    if (err) {
      console.error('failed to retrieve tags:', err);
      return res.status(500).json({ error: 'Failed to retrieve tags.' });
    }

    console.log('Retrieved tags:', result);
    const arrayOfTags = result.map((item) => item.preference)
    return res.status(200).json({ message: 'Tags Retrieved', arrayOfTags });
  })
})