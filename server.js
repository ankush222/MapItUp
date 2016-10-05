var express = require('express');
var app = express();
var fs = require("fs");
var bcrypt = require("bcrypt");

var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'my-db-instance.clvztxhdj6v1.us-west-2.rds.amazonaws.com',
  user: 'db_user',
  password: 'aadhar91',
  database: 'mapitup'
})

connection.connect();

app.get('/', function (req, res) {
   res.render('index.ejs');
})
app.get('/index', function (req, res) {
   res.render('index.ejs');
})

app.get('/profile', function (req, res) {
   res.render('profile.ejs', {name: 'whatsMyName'});
})

app.get('/home', function (req, res) {
   res.render('home.ejs', {name: 'whatsMyName'});
})

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/signUp', function (req, res) {
    email = req.body.email;
    password1 = req.body.password1;
    password2 = req.body.password2;
    firstName = req.body.firstName;
    lastName = req.body.lastName;

    if(password1 != password2)
    {
        return { "success": 404 };
    }
    var hash = bcrypt.hashSync(password1, 10);
    console.log("hash successful");
    // check here password 1 == password 2
    connection.query('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, hash], function(err, rows, fields) {
    if (err)
        console.log("error in inserting!", err);
    });
    // console.log("inserted into database");
    res.render('home.ejs', {name: firstName});
})

var server = app.listen(3000, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})

