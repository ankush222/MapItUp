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
    var id = req.query.userId;
    connection.query('SELECT * from users WHERE `userId` = ?', [userId], function (err, rows, fields) {
        if (err) {
            console.log("error in query", err);
            res.sendStatus(404);

        }
        else {
            name = rows[0].firstName;
            res.render('profile.ejs', { name: name, userId: id });
        }
    });
})

app.get('/home', function (req, res) {
    var userId = req.query.userId;
    var name;
    var countries;

    async.series([
        function (callback) {
            // do some stuff ...
            connection.query('SELECT * from users WHERE `userId` = ?', [userId], function (err, rows, fields) {
                if (err) {
                    console.log("error in query", err);
                    callback(err);
                }
                else {
                    name = rows[0].firstName;
                    callback(null);
                }
            });
        },
        function (callback) {
            // do some more stuff ...
            connection.query('SELECT country from countries where `id` = ?', [userId], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    countries = rows;
                    callback(null);
                }
            });
        },
    ],
        // optional callback
        function (err, results) {
            if (err) {
                res.sendStatus(404);
            }
            else {
                var country = [];
                for (var i = 0; i < countries.length; i++) {
                    country[i] = JSON.stringify(countries[i].country);
                }
                // console.log("country = ", country);
                res.render('home.ejs', { name: name, userId: userId, countries: country });
            }
        });

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
    var userId = req.body.userId;
    async.series([
        function (callback) {
            // do some stuff ...
            connection.query('DELETE from countries WHERE `id` = ?', [userId], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else
                    callback(null);
            });
        },
        function (callback) {
            // do some more stuff ...
            connection.query('DELETE from users WHERE `userId` = ?', [userId], function (err, rows, fields) {
                if (err) {
                    callback(err);
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
                res.status(404).send("Error in deactivating account");
            }
            else
                res.redirect('/index');
        });
})

app.post('/addVisited', function (req, res) {
    var country = req.body.country;
    var userId = req.body.userId;
    console.log(userId);

    connection.query('INSERT INTO countries (id, country) VALUES (?, ?)', [userId, country], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
        else
            res.redirect('/home?' + "userId=" + userId);
    });
})

app.get('/getVisited', function (req, res) {

    var userId = req.query.userId;
    connection.query('SELECT country from countries where `id` = ?', [userId], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
        else
            res.send({ countries: rows });
    });
})

app.post('/updateLocation', function (req, res) {

})

app.post('/addFavorite', function (req, res) {

    var userId = req.body.userId;
    var country = req.body.country;
    connection.query('UPDATE countries SET `favorite` = ? WHERE `id` = ? AND `country` = ?', [true, userId, country], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
        else
            res.send('OK');
    });
})

app.get('/getFavorite', function (req, res) {
    var userId = req.query.userId;

    connection.query('SELECT country from countries where `id` = ? AND `favorite` = ?', [userId, true], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
        else
            res.send({ countries: rows });
    });
})

app.post('/signOut', function (req, res) {
    //sign out here 
    res.render('index.ejs');
})

app.post('/signUp', function (req, res) {
    var email = req.body.email;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userId;

    console.log("password = ", password1);

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
                    callback(err);
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
                else {
                    //console.log("res = ", fields);
                    callback(null);
                }

            });
        },
        function (callback) {
            // do some stuff ...
            connection.query('SELECT * from users WHERE `email` = ?', [email], function (err, rows, fields) {
                if (err) {
                    console.log("error in query", err);
                    callback(err);
                }
                else {
                    userId = rows[0].userId;
                    console.log("rows = ", userId);
                    callback(null);

                }
            });
        },
    ],
        // optional callback
        function (err, results) {
            // results is now equal to ['one', 'two']
            if (err) {
                res.sendStatus(404);
            }
            else
                res.redirect('/home?' + "userId=" + userId);
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
            res.redirect('/home?' + "userId=" + userId);
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

