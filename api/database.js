// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     multipleStatements: true
// });

// const schema = 
// "
//     create table if not exists user( 
//     user_ID int primary key auto_increment, 
//     first_name varchar(255) not null,
//     middle_name varchar(255) null,
//     last_name varchar(255) null,
//     DOB date not null, gender int null,
//     district varchar(255) not null,
//     city varchar(255) not null,
//     street_address varchar(255) not null,
//     date_created date not null,
//     email varchar(255) not null,
//     password varchar(255) not null,
//     contact_no varchar(20)
// )

// create table if not exists chat(
// 	chat_ID int primary key auto_increment,
// 	sender_ID int,
// 	receiver_ID int,
//     text_message text,
//     message_time timestamp default current_timestamp,
//     foreign key(sender_ID) references user(user_ID) on delete cascade,
//     foreign key(receiver_ID) references user(user_ID) on delete cascade
// )

// create table connections(
// 	connection_ID int primary key auto_increment,
//     request_sender_ID int,
//     request_receiver_ID int,
//     request_time timestamp,
//     foreign key(request_sender_ID) references user(user_ID) on delete cascade,
//     foreign key(request_receiver_ID) references user(user_ID) on delete cascade
// );
// ";

// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   connection.query("USE CONNECTIFY", function (err, result) {
//     if (err) throw err;
//     console.log("Database Selected");
//   });
// });

// // const pool = createPool({
// //     host: "localhost",
// //     user: "root",
// //     password: "Bishistp@150",
// //     database: "your_database_name"
// // })

// // module.exports= pool;