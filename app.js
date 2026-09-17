const path = require("path");
const express = require("express");
const mysql = require("mysql2")

const app = express();

const pool = mysql.createPool({
  host: "localhost",
  user: "csce41333user",
  password: "csce41333pass",
  database: "assign1",
  connectionLimit: 5,
});

//*** Middleware */
app.use(express.json());
app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

//** Web API */
//GET /users
app.get("/users", function (req, res) {
  const sql = "SELECT * FROM users";
  pool.execute(sql, function (err, result, fields) {
    res.json(result);
  });
});

//API Endpoint: POST /users
app.post("/users", (req, res) => {
  const {lastname, firstname, email, username, passwd} = req.body;
  if(!lastname || !firstname || !email || !username || !passwd){
    return res.status(400).json({success: false, error: "Need All Fields."});
  }
  const query = 'INSERT INTO users (lastname, firstname, email, username, passwd ) VALUES (?, ?, ?, ?, ?)';
  pool.query(query, [lastname, firstname, email, username, passwd], (err, result) => {
    if(err) return res.status(500).json({success: false, error: err.message});
    res.status(201).json({userID: result.insertId, lastname, firstname, email, username, passwd});
  });

});


app.listen(3000, function () {
  console.log("Listening on port 3000..");
});
