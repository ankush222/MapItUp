var express = require('express');
var app = express();
var fs = require("fs");
var bcrypt = require("bcrypt");
var async = require("async");
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
//var upload = multer({ dest: 'uploads/' });
var AWS = require('aws-sdk');
var session = require("client-sessions");
app.use(session({
  cookieName: 'session',
  secret: 'shhhhhhhh',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// app.use(busboy());
// app.use(busboy({ immediate: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    connection.query('SELECT * FROM `users` WHERE `email` = ? limit 1', [req.session.user.email], function (error, results, fields) {
      if (results) {
        req.user = results[0];
        delete req.user.password; // delete the password from the session
        req.session.user = results[0];  //refresh the session value
        res.locals.user = results[0];
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

app.use(multer({ dest: 'uploads/' }).array('pic', 50));
// app.use(session({secret: 'ssshhhhh'}));


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
    var id = req.session.user.userId;
    // console.log("session userID = ", req.session.user.userId);

    var picId;
    var s3 = new AWS.S3();
    var signedUrl;
    var firstName;
    var lastName;
    var location;
    var email;
    // var sess = req.session;
    // console.log("session = ", session);


    async.series([

        function (callback) {
            connection.query('SELECT profilePic from users where `userId` = ?', [id], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    picId = rows[0].profilePic;
                    callback(null);
                }
            })
        },
        function (callback) {
            if (picId === null)
                callback(null);
            else {
                var params = { Bucket: 'mapitup', Key: picId };
                s3.getSignedUrl('getObject', params, function (err, url) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        signedUrl = url;
                        callback(null);
                    }
                });
            }
        },
        function (callback) {
            connection.query('SELECT * from users WHERE `userId` = ?', [id], function (err, rows, fields) {
                if (err) {
                    console.log("error in query", err);
                    callback(err);
                }
                else {
                    firstName = rows[0].firstName;
                    lastName = rows[0].lastName;
                    location = rows[0].location;
                    email = rows[0].email;
                    callback(null);
                }
            });
        }
    ],

        function (err, results) {
            if (err) {
                res.status(404).send("Error in adding visited country");
            }
            else
                res.render('profile.ejs', { firstName: firstName, lastName: lastName, userId: id, location: location, profilePic: signedUrl, email: email });
        }

    );
})


app.get('/otherProfile', function (req, res) {
    var id = req.query.userId;
    var currentId = req.session.user.userId;
    // console.log("session userID = ", req.session.user.userId);

    var picId;
    var s3 = new AWS.S3();
    var signedUrl;
    var firstName;
    var lastName;
    var location;
    var email;
    // var sess = req.session;
    // console.log("session = ", session);


    async.series([

        function (callback) {
            connection.query('SELECT profilePic from users where `userId` = ?', [id], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    picId = rows[0].profilePic;
                    callback(null);
                }
            })
        },
        function (callback) {
            if (picId === null)
                callback(null);
            else {
                var params = { Bucket: 'mapitup', Key: picId };
                s3.getSignedUrl('getObject', params, function (err, url) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        signedUrl = url;
                        callback(null);
                    }
                });
            }
        },
        function (callback) {
            connection.query('SELECT * from users WHERE `userId` = ?', [id], function (err, rows, fields) {
                if (err) {
                    console.log("error in query", err);
                    callback(err);
                }
                else { 
                    firstName = rows[0].firstName;
                    lastName = rows[0].lastName;
                    location = rows[0].location;
                    email = rows[0].email;
                    callback(null);
                }
            });
        }
    ],

        function (err, results) {
            if (err) {
                res.status(404).send("Error in adding visited country");
            }
            else
                res.render('profile.ejs', { firstName: firstName, lastName: lastName, userId: id, location: location, profilePic: signedUrl, email: email, currentId: currentId });
        }

    );
})

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/signUp');
  } else {
    next();
  }
};

app.get('/home', requireLogin, function (req, res) {
    var userId = req.session.user.userId;
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
            connection.query('SELECT * from countries where `id` = ?', [userId], function (err, rows, fields) {
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
                var favorites = [];
                var temp = 0;
                for (var i = 0; i < countries.length; i++) {
                    country[i] = JSON.stringify(countries[i].country);
                    if (countries[i].favorite) {
                        favorites[temp] = JSON.stringify(countries[i].country);
                        temp++;
                    }
                }
                res.render('home.ejs', { name: name, userId: userId, countries: country, favorites: favorites });
            }
        });

})

app.post('/search', function (req, res) {
    var userId = req.body.userId;
    var country = req.body.search;
    //search here
    //return page results.ejs ?    
    // do some stuff ...
    connection.query('SELECT country from countries where `id` = ? AND `country` = ?', [userId, country], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
        else if (rows.length > 0) {
            country = [];
            // console.log(rows);
            for (var i = 0; i < rows.length; i++) {
                country[i] = JSON.stringify(rows[i].country);
            }
            res.render('results.ejs', { countries: country, userId: userId });
        }
        else
            res.sendStatus(404);
    });
})

app.get('/signIn', function (req, res) {
    res.render('signIn.ejs');
})

app.post('/deactivate', function (req, res) {
    //deactivate here 
    var userId = req.body.userId;
    console.log("userId = ", userId);
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

    async.series([
        function (callback) {
            // do some stuff ...
            connection.query('SELECT * from countries where `id` = ? AND `country` = ?', [userId, country], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else if (rows.length > 0) {
                    res.redirect('/home?' + "userId=" + userId);
                }
                else
                    callback(null);
            });
        },
        function (callback) {
            // do some more stuff ...
            connection.query('INSERT INTO countries (id, country) VALUES (?, ?)', [userId, country], function (err, rows, fields) {
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
            if (err) {
                res.status(404).send("Error in adding visited country");
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

app.post('/updateInfo', function (req, res) {

    var userId = req.body.userId;
    var location = req.body.location;
    var file = req.files;
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    if (location === "")
        location = null;

    if (password === "")
        password = null;
    else
        var hash = bcrypt.hashSync(password, 10);

    var s3 = new AWS.S3();
    if (file.length > 0)
        var params = { Bucket: 'mapitup', Body: fs.createReadStream(file[0].path), Key: file[0].filename.toString(), ACL: 'public-read', ContentType: 'image/jpeg' };

    async.series([
        function (callback) {
            if (file.length <= 0)
                callback(null);
            else {
                s3.upload(params, function (err, data) {
                    if (err) {
                        console.log("Error uploading data: ", err);
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            }
        },
        function (callback) {
            if (file.length <= 0)
                callback(null);
            else {
                connection.query('UPDATE users SET `profilePic` = ? WHERE `userId` = ?', [file[0].filename.toString(), userId], function (err, rows, fields) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null);
                    }
                });
            }
        },
        function (callback) {
            if (password === null)
                callback(null);
            else {
                connection.query('UPDATE users SET `firstName` = ?, `lastName` = ?, `email` = ?, `password` = ?, `location` = ? where `userId` = ?', [firstName, lastName, email, hash, location, userId], function (err, rows, fields) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null);
                    }
                });
            }
        },
        function (callback) {
            if (!(password === null))
                callback(null);
            else {
                connection.query('UPDATE users SET `firstName` = ?, `lastName` = ?, `email` = ?, `location` = ? where `userId` = ?', [firstName, lastName, email, location, userId], function (err, rows, fields) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null);
                    }
                });
            }
        },
    ],
        function (err, results) {
            if (err) {
                res.status(404).send("Error in adding visited country");
            }
            else
                res.redirect('/profile?' + "userId=" + req.session.user.userId);
        });
})

app.post('/getLocation', function (req, res) {

    var userId = req.body.userId;
    connection.query('SELECT location from users WHERE `userId` = ?', [location, userId], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
        else
            res.redirect('/profile?' + "userId=" + userId);
    });
})

app.post('/addFavorite', function (req, res) {

    var userId = req.body.userId;
    var country = req.body.country;
    connection.query('UPDATE countries SET `favorite` = ? WHERE `id` = ? AND `country` = ?', [true, userId, country], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
        else
            res.redirect('/home?' + "userId=" + userId);
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

app.get('/signOut', function (req, res) {
    //sign out here 
    req.session.reset();
    res.render('index.ejs');
})

app.post('/signUp', function (req, res) {
    console.log("request = ", req);
    var email = req.body.email;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userId;

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
                    req.user = rows[0];
                    delete req.user.password; // delete the password from the session
                    req.session.user = rows[0];  //refresh the session value
                    res.locals.user = rows[0];
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

    var results;
    connection.query('SELECT * FROM `users` WHERE `email` = ?', [email], function (error, results, fields) {

        if (results.length === 0)
            res.status(404).send('user not found');

        console.log("results = ", results);
        var userId = results[0].userId;
        var match = bcrypt.compareSync(password, results[0].password)
        if (match === true) {
            req.session.user = results[0];
            res.redirect('/home?' + "userId=" + results[0].userId);
        }
        else {
            res.status(401).send('username and password do not match');
        }

    });
})

app.get('/countries', function (req, res) {
    var userId = req.query.userId;
    var country = req.query.country;
    var reviews = new Array();
    var reviewsWithPics = new Array();
    var countryPics = new Array();
    var reviewId;

    async.series([
        function (callback) {
            connection.query('SELECT * FROM reviews where `country` = ?', [country], function (error, results, fields) {
                if (error) {
                    callback(error);
                }
                else {
                    for (var i = 0; i < results.length; i++) {
                        obj = new Object();
                        obj.text = results[i].review;
                        obj.user = results[i].userId;
                        obj.rating = results[i].rating;
                        obj.reviewId = results[i].reviewId;
                        obj.cost = results[i].cost;
                        obj.pics = [];
                        reviewsWithPics.push(obj);
                    }
                    callback(null);
                }
            });
        },

        function (callback) {
            async.eachSeries(reviewsWithPics, function (review, callb) {
                connection.query('SELECT * from reviewPics WHERE `reviewId` = ?', review.reviewId, function (err, rows, fields) {
                    if (err) {
                        console.log("error in inserting", err);
                        callb(err);
                    }
                    else {
                        if (rows.length <= 0) {
                            callb(null);
                        }
                        else {
                            var obj = new Object();
                            obj.pics = [];
                            var s3 = new AWS.S3();
                            var paramArray = new Array();
                            for (var i = 0; i < rows.length; i++) {
                                userId = Number(userId);
                                if (!rows[i].private || (rows[i].private && rows[i].userId === userId)) {
                                    var params = { Bucket: 'mapitup', Key: rows[i].picId };
                                    paramArray.push(params);
                                }
                            }
                            if (paramArray.length <= 0) {
                                callb(null);
                            }
                            else {
                                var pos = 0;
                                async.eachSeries(paramArray, function (params, callbak) {
                                    s3.getSignedUrl('getObject', params, function (err, url) {
                                        if (err) {
                                            callbak(err);
                                        }
                                        else {
                                            obj.pics[pos++] = url;
                                            callbak(null);
                                        }
                                    });
                                });
                                for (var i = 0; i < reviewsWithPics.length; i++) {
                                    if (reviewsWithPics[i].reviewId === review.reviewId) {
                                        reviewsWithPics[i].pics = obj.pics;
                                        break;
                                    }
                                }
                                callb(null);
                            }
                        }
                    }
                })
            },
                function (err, data) {
                    if (err)
                        callback(err);
                    else
                        callback(null);
                }
            );
        },
        function (callback) {
            connection.query('SELECT * from countryPics WHERE `country` = ?', country, function (err, rows, fields) {
                if (err) {
                    console.log("error in inserting", err);
                    callback(err);
                }
                else {
                    if (rows.length <= 0) {
                        callback(null);
                    }
                    else {
                        var s3 = new AWS.S3();
                        var paramArray = new Array();
                        for (var i = 0; i < rows.length; i++) {
                            userId = Number(userId);
                            if (!rows[i].private || (rows[i].private && rows[i].userId === userId)) {
                                var params = { Bucket: 'mapitup', Key: rows[i].picId };
                                paramArray.push(params);
                            }
                        }
                        if (paramArray.length <= 0)
                            callback(null);
                        else {
                            async.eachSeries(paramArray, function (params, callbak) {
                                s3.getSignedUrl('getObject', params, function (err, url) {
                                    if (err) {
                                        callbak(err);
                                    }
                                    else {
                                        countryPics.push(url);
                                        callbak(null);
                                    }
                                });
                            });
                            callback(null);
                        }
                    }
                }
            })
        }
    ],
        // optional callback
        function (err, results) {
            // results is now equal to ['one', 'two']
            if (err) {
                res.sendStatus(404);
            }
            else {
                reviewsWithPics = reviewsWithPics.reverse();
                res.render('countries.ejs', { userId: userId, country: country, reviews: reviewsWithPics, countryPics: countryPics });
            }
        });
})

app.post('/addReview', function (req, res) {
    var text = req.body.text;
    var userId = req.body.userId;
    var country = req.body.country;
    var rating = req.body.rating;
    var private = req.body.private;
    var cost = req.body.cost;
    if(cost == "")
        cost = null;
    if (private === "true")
        private = true;
    else
        private = false;
    var reviewId;
    var s3 = new AWS.S3();
    var files = req.files;
    // console.log("text = ", text);
    // console.log("id = ", userId);
    // console.log("country = ", country);
    // console.log("rating = ", rating);

    async.series([
        function (callback) {
            // do some stuff ...
            connection.query('INSERT into reviews (country, userId, review, rating, private, cost) values (?, ?, ?, ?, ?, ?)', [country, userId, text, rating, private, cost], function (err, rows, fields) {
                if (err) {
                    console.log("error in inserting", err);
                    callback(err);
                }
                else {
                    callback(null);
                }
            });
        },
        function (callback) {
            // do some more stuff ...
            connection.query('SELECT reviewId FROM reviews ORDER BY reviewId DESC LIMIT 1', function (err, rows, fields) {
                if (err) {
                    console.log("error in getting reviewId!", err);
                    callback(true);
                }
                else {
                    //console.log("res = ", fields);
                    reviewId = rows[0].reviewId;
                    callback(null);
                }

            });
        },
        function (callback) {
            var inserted = 0;
            var paramArray = new Array();
            if (files.length <= 0) {
                console.log("files is empty");
                callback(null);
            }
            else {
                for (var i = 0; i < files.length; i++) {
                    var params = { Bucket: 'mapitup', Body: fs.createReadStream(files[i].path), Key: files[i].filename.toString(), ACL: 'public-read', ContentType: 'image/jpeg' };
                    paramArray.push(params);
                }
                async.eachSeries(paramArray, function (params, callb) {
                    s3.upload(params, function (err, data) {
                        if (err) {
                            console.log("Error uploading data: ", err);
                            callb(err);
                        } else {
                            callb(null);
                        }
                    })
                },
                    function (err, data) {
                        if (err)
                            callback(err);
                        else
                            callback(null);
                    }
                );
            }
        },
        function (callback) {
            // do some stuff ...
            var picIds = new Array();
            for (var i = 0; i < files.length; i++) {
                picIds.push(files[i].filename.toString());
            }
            async.eachSeries(picIds, function (picId, callb) {
                connection.query('INSERT into reviewPics (reviewId, picId, country) values (?, ?, ?)', [reviewId, picId, country], function (err, rows, fields) {
                    if (err) {
                        console.log("error in inserting", err);
                        callb(err);
                    }
                    else {
                        callb(null);
                    }
                })
            },
                function (err, data) {
                    if (err)
                        callback(err);
                    else
                        callback(null);
                }
            );
        }
    ],
        // optional callback
        function (err, results) {
            // results is now equal to ['one', 'two']
            if (err) {
                console.log("error = ", err);
                res.sendStatus(404);
            }
            else {
                res.redirect('/countries?' + "userId=" + userId + "&country=" + country);
            }
        });
})

app.post('/addPics', function (req, res) {

    var s3 = new AWS.S3();
    var files = req.files;
    var country = req.body.country;
    var private = req.body.private;
    private = private.toString();
    if (private === "true")
        private = true;
    else
        private = false;
    var userId = req.body.userId;

    async.series([
        function (callback) {
            var inserted = 0;
            var paramArray = new Array();
            if (files.length <= 0) {
                console.log("files is empty");
                callback(null);
            }
            else {
                for (var i = 0; i < files.length; i++) {
                    var params = { Bucket: 'mapitup', Body: fs.createReadStream(files[i].path), Key: files[i].filename.toString(), ACL: 'public-read', ContentType: 'image/jpeg' };
                    paramArray.push(params);
                }
                async.eachSeries(paramArray, function (params, callb) {
                    s3.upload(params, function (err, data) {
                        if (err) {
                            console.log("Error uploading data: ", err);
                            callb(err);
                        } else {
                            callb(null);
                        }
                    })
                },
                    function (err, data) {
                        if (err)
                            callback(err);
                        else
                            callback(null);
                    }
                );
            }
        },
        function (callback) {
            // do some stuff ...
            var picIds = new Array();
            for (var i = 0; i < files.length; i++) {
                picIds.push(files[i].filename.toString());
            }
            async.eachSeries(picIds, function (picId, callb) {
                connection.query('INSERT into countryPics (country, picId, private, userId) values (?, ?, ?, ?)', [country, picId, private, userId], function (err, rows, fields) {
                    if (err) {
                        console.log("error in inserting", err);
                        callb(err);
                    }
                    else {
                        callb(null);
                    }
                })
            },
                function (err, data) {
                    if (err)
                        callback(err);
                    else
                        callback(null);
                }
            );
        }
    ],
        // optional callback
        function (err, results) {
            // results is now equal to ['one', 'two']
            if (err) {
                console.log("error = ", err);
                res.sendStatus(404);
            }
            else {
                res.redirect('/countries?' + "userId=" + userId + "&country=" + country);
            }
        });
})

app.get('/updateInfo', function (req, res) {
    var id = req.query.userId;

    var picId;
    var s3 = new AWS.S3();
    var signedUrl;
    var firstName;
    var lastName;
    var location;
    var email;

    async.series([

        function (callback) {
            connection.query('SELECT profilePic from users where `userId` = ?', [id], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    picId = rows[0].profilePic;
                    callback(null);
                }
            })
        },
        function (callback) {
            if (picId === null)
                callback(null);
            else {
                var params = { Bucket: 'mapitup', Key: picId };
                s3.getSignedUrl('getObject', params, function (err, url) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        signedUrl = url;
                        callback(null);
                    }
                });
            }
        },
        function (callback) {
            connection.query('SELECT * from users WHERE `userId` = ?', [id], function (err, rows, fields) {
                if (err) {
                    console.log("error in query", err);
                    callback(err);
                }
                else {
                    firstName = rows[0].firstName;
                    lastName = rows[0].lastName;
                    location = rows[0].location;
                    email = rows[0].email;
                    callback(null);
                }
            });
        }
    ],

        function (err, results) {
            if (err) {
                res.status(404).send("Error in adding visited country");
            }
            else
                res.render('updateInfo.ejs', { firstName: firstName, lastName: lastName, userId: id, location: location, profilePic: signedUrl, email: email });
        }

    );
})

var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})

