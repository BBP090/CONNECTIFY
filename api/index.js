const express = require("express");
const bodyParser = require("body-parser");
const pool= require("./database");
const multer = require('multer');
const path = require('path');

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log("Server running on port 8000");
});



app.use('/uploads', express.static('uploads'));

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

  app.post('/upload', upload.single('photo'), (req, res) => {
  console.log("BODY:", req.body); // should log if text is sent
  console.log("FILE:", req.file); // ✅ must NOT be undefined

  if (!req.file) return res.status(400).send("No file uploaded");

  const imageUrl = `http://192.168.1.68:8000/uploads/${req.file.filename}`;
  res.send(`Uploaded: ${imageUrl}`);
  // ✅ INSERT image URL into SQL
  pool.query(
    'INSERT INTO photos (image_url) VALUES (?)',
    [imageUrl],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database insert error');
      }
      res.send({ success: true, imageUrl });
    }
  );
});
