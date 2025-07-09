const express = require("express");
const bodyParser = require("body-parser");
const pool= require("./database");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log("Server running on port 8000");
});