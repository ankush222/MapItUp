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

var path = require('path');
var bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, 'public')));
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'sharoon',
  password: 'password',
  database: 'mapitup'
})

connection.connect();

// connection.query('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', ['Ankush', 'Jain', 'jain97@purdue.edu', 'aadhar91'], function(err, rows, fields) {
//   if (err)
//     console.log("error in inserting!", err);
// });

app.use(express.static('public'));
app.get('/index', function (req, res) {
   res.sendFile( __dirname + "/public/" + "index.html" );
})

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/test', function (req, res) {
    console.log('hello');
    //console.log("req = ", res);
    console.log(req.body.email);
})

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})
