var express = require('express');
var app = express();
var fs = require("fs");
var bcrypt = require("bcrypt");
var async = require("async");
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

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
    res.render('profile.ejs', { name: 'whatsMyName' });
})

app.get('/home', function (req, res) {
    res.render('home.ejs', { name: 'whatsMyName', country: 'US' });
})

app.get('/search', function (req, res) {
    console.log(req.query.search);
    //search here
    //return page results.ejs ?
    var fruits = ["Banana", "Orange", "Apple", "Mango"];
    res.render('results.ejs', { fruits: fruits });
})

app.get('/signIn', function (req, res) {
    res.render('signIn.ejs');
})

app.post('/deactivate', function (req, res) {
    //deactivate here 
    res.render('index.ejs');
})

app.post('/signOut', function (req, res) {
    //sign out here 
    res.render('index.ejs');
})

app.post('/signUp', function (req, res) {
    email = req.body.email;
    password1 = req.body.password1;
    password2 = req.body.password2;
    firstName = req.body.firstName;
    lastName = req.body.lastName;

    if (password1 != password2) {
        res.status(404).send('passwords do not match');
    }
    var hash = bcrypt.hashSync(password1, 10);

    // check here password 1 == password 2

    async.series([
        function (callback) {
            // do some stuff ...
            connection.query('SELECT * from users WHERE `email` = ?', [email], function (err, rows, fields) {
                if (err) {
                    console.log("error in query", err);
                    callback(true);
                }
                else if (rows.length > 0) {
                    console.log("user already exists");
                    callback(true);
                }
                else
                    callback(null);
            });
        },
        function (callback) {
            // do some more stuff ...
            connection.query('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, hash], function (err, rows, fields) {
                if (err) {
                    console.log("error in inserting!", err);
                    callback(true);
                }
                else
                    callback(null);
            });
        }
    ],
        // optional callback
        function (err, results) {
            // results is now equal to ['one', 'two']
            if (err) {
                res.sendStatus(404);
            }
            else
                // res.send('OK');
                res.redirect('/home');
        });

})

app.post('/signIn', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    console.log("email = ", email);
    connection.query('SELECT * FROM `users` WHERE `email` = ?', [email], function (error, results, fields) {

        if (results.length === 0)
            res.status(404).send('user not found');

        var match = bcrypt.compareSync(password, results[0].password)
        if (match === true) {
            res.redirect('/home');
        }
        else {
            res.status(401).send('username and password do not match');
        }

    });
})

var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})

