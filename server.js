var express = require('express');
var app = express();
var fs = require("fs");

app.get('/listUsers', function (req, res) {
  
 fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    	console.log("dirname = ", __dirname);
		console.log( data );
    	res.end( data );
   });
})

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aadhar91',
  database: 'mapitup'
})

connection.connect();

connection.query('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', ['Ankush', 'Jain', 'jain97@purdue.edu', 'aadhar91'], function(err, rows, fields) {
  if (err)
    console.log("error in inserting!", err);
});

app.use(express.static('public'));
app.get('/index', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})
