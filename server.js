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

app.use(function (req, res, next) {
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

var map = new Map();

map.set("Ascension Island", 'AC');
map.set("Andorra", 'AD');
map.set("United Arab Emirates", 'AE');
map.set("Afghanistan", 'AF');
map.set("Antigua and Barbuda", 'AG');
map.set("Anguilla", 'AI');
map.set("Albania", 'AL');
map.set("Armenia", 'AM');
map.set("Netherlands Antilles", 'AN');
map.set("Angola", 'AO');
map.set("Antarctica", 'AQ');
map.set("Argentin", 'AR');
map.set("American Samoa", 'AS');
map.set("Austria", 'AT');
map.set("Australia", 'AU');
map.set("Aruba", 'AW');
map.set("Aland Islands", 'AX');
map.set("Azerbaijan", 'AZ');
map.set("Bosnia and Herzegovina", 'BA');
map.set("Barbados", 'BB');
map.set("Bangladesh", 'BD');
map.set("Belgium", 'BE');
map.set("Burkina Faso", 'BF');
map.set("Bulgaria", 'BG');
map.set("Bahrain", 'BH');
map.set("Burundi", 'BI');
map.set("Benin", 'BJ');
map.set("Bermuda", 'BM');
map.set("Brunei Darussalam", 'BN');
map.set("Bolivia", 'BO');
map.set("Brazil", 'BR');
map.set("Bahamas", 'BS');
map.set("Bhutan", 'BT');
map.set("Bouvet Island", 'BV');
map.set("Botswana", 'BW');
map.set("Belarus", 'BY');
map.set("Belize", 'BZ');
map.set("Canada", 'CA');
map.set("Cocos (Keeling) Islands", 'CC');
map.set("Congo, Democratic Republic", 'CD');
map.set("Central African Republic", 'CF');
map.set("Congo", 'CG');
map.set("Switzerland", 'CH');
map.set("Cote D'Ivoire (Ivory Coast)", 'CI');
map.set("Cook Islands", 'CK');
map.set("Chile", 'CL');
map.set("Cameroon", 'CM');
map.set("China", 'CN');
map.set("Colombia", 'CO');
map.set("Costa Rica", 'CR');
map.set("Czechoslovakia (former)", 'CS');
map.set("Cuba", 'CU');
map.set("Cape Verde", 'CV');
map.set("Christmas Island", 'CX');
map.set("Cyprus", 'CY');
map.set("Czech Republic", 'CZ');
map.set("Germany  ", 'DE');
map.set("Djibouti ", 'DJ');
map.set("Denmark  ", 'DK');
map.set("Dominica ", 'DM');
map.set("Dominican Republic", 'DO');
map.set("Algeria         ", 'DZ');
map.set("Ecuador         ", 'EC');
map.set("Estonia         ", 'EE');
map.set("Egypt", 'EG');
map.set("Western Sahara", 'EH');
map.set("Eritrea", 'ER');
map.set("Spain", 'ES');
map.set("Ethiopia", 'ET');
map.set("European Union", '   EU  ');
map.set("Finland", 'FI');
map.set("Fiji", 'FJ');
map.set("Falkland Islands (Malvinas)", 'FK');
map.set("Micronesia", 'FM');
map.set("Faroe Islands", 'FO');
map.set("France", 'FR');
map.set("France, Metropolitan", 'FX');
map.set("Gabon", 'GA');
map.set("Great Britain (UK)", 'GB');
map.set("Grenada", 'GD');
map.set("Georgia", 'GE');
map.set("French Guiana", 'GF');
map.set("Guernsey", 'GG');
map.set("Ghana", 'GH');
map.set("Gibraltar", 'GI');
map.set("Greenland", 'GL');
map.set("Gambia", 'GM');
map.set("Guinea", 'GN');
map.set("Guadeloupe", 'GP');
map.set("Equatorial Guinea", 'GQ');
map.set("Greece", 'GR');
map.set("S. Georgia and S. Sandwich Isls.    ", '   GS  ');
map.set("Guatemala", 'GT');
map.set("Guam", 'GU');
map.set("Guinea-Bissau", 'GW');
map.set("Guyana", 'GY');
map.set("Hong Kong", 'HK');
map.set("Heard and McDonald Islands", 'HM');
map.set("Honduras        ", 'HN');
map.set("Croatia (Hrvatska)", 'HR');
map.set("Haiti", 'HT');
map.set("Hungary", 'HU');
map.set("Indonesia", 'ID');
map.set("Ireland", 'IE');
map.set("Israel", 'IL');
map.set("Isle of Man", 'IM');
map.set("India", 'IN');
map.set("British Indian Ocean Territory", 'IO');
map.set("Iraq", 'IQ');
map.set("Iran", 'IR  ');
map.set("Iceland", 'IS');
map.set("Italy", 'IT');
map.set("Jersey", 'JE');
map.set("Jamaica", 'JM');
map.set("Jordan", 'JO');
map.set("Japan", 'JP');
map.set("Kenya", 'KE');
map.set("Kyrgyzstan", 'KG');
map.set("Cambodia", 'KH');
map.set("Kiribati", 'KI');
map.set("Comoros", 'KM');
map.set("Saint Kitts and Nevis", 'KN');
map.set("Korea (North)", 'KP');
map.set("Korea (South)", 'KR');
map.set("Kuwait", 'KW');
map.set("Cayman Islands", 'KY');
map.set("Kazakhstan", 'KZ');
map.set("Laos", 'LA');
map.set("Lebanon", 'LB');
map.set("Saint Lucia", 'LC');
map.set("Liechtenstein", 'LI');
map.set("Sri Lanka", 'LK');
map.set("Liberia", 'LR');
map.set("Lesotho", 'LS');
map.set("Lithuania", 'LT');
map.set("Luxembourg", 'LU');
map.set("Latvia", 'LV');
map.set("Libya", 'LY');
map.set("Morocco", 'MA');
map.set("Monaco", 'MC');
map.set("Moldova", 'MD');
map.set("Montenegro", 'ME');
map.set("Madagascar", 'MG');
map.set("Marshall Islands", 'MH');
map.set("Macedonia", 'MK');
map.set("Mali", 'ML');
map.set("Myanmar", 'MM');
map.set("Mongolia", 'MN');
map.set("Macau", 'MO');
map.set("Northern Mariana Islands", 'MP');
map.set("Martinique", 'MQ');
map.set("Mauritania", 'MR');
map.set("Montserrat", 'MS');
map.set("Malta", 'MT');
map.set("Mauritius", 'MU');
map.set("Maldives", 'MV');
map.set("Malawi", 'MW');
map.set("Mexico", 'MX');
map.set("Malaysia", 'MY');
map.set("Mozambique", 'MZ');
map.set("Namibia", 'NA');
map.set("New Caledonia", 'NC');
map.set("Niger", 'NE');
map.set("Norfolk Island", 'NF');
map.set("Nigeria", 'NG');
map.set("Nicaragua", 'NI');
map.set("Netherlands", 'NL');
map.set("Norway", 'NO');
map.set("Nepal", 'NP');
map.set("Nauru", 'NR');
map.set("Neutral Zone", 'NT');
map.set("Niue", 'NU');
map.set("New Zealand (Aotearoa)", 'NZ');
map.set("Oman", 'OM');
map.set("Panama", 'PA');
map.set("Peru", 'PE');
map.set("French Polynesia", 'PF');
map.set("Papua New Guinea", 'PG');
map.set("Philippines", 'PH');
map.set("Pakistan", 'PK');
map.set("Poland", 'PL');
map.set("St. Pierre and Miquelon", 'PM');
map.set("Pitcairn", 'PN');
map.set("Puerto Rico", 'PR');
map.set("Palestinian Territory, Occupied", 'PS');
map.set("Portugal", 'PT');
map.set("Palau", 'PW');
map.set("Paraguay", 'PY');
map.set("Qatar", 'QA');
map.set("Reunion", 'RE');
map.set("Romania", 'RO');
map.set("Serbia", 'RS');
map.set("Russian Federation", 'RU');
map.set("Rwanda", 'RW');
map.set("Saudi Arabia", 'SA');
map.set("Solomon Islands", 'SB');
map.set("Seychelles", 'SC');
map.set("Sudan", 'SD');
map.set("Sweden", 'SE');
map.set("Singapore", 'SG');
map.set("St. Helena", 'SH');
map.set("Slovenia", 'SI');
map.set("Svalbard & Jan Mayen Islands", 'SJ');
map.set("Slovak Republic", 'SK');
map.set("Sierra Leone", 'SL');
map.set("San Marino", 'SM');
map.set("Senegal", 'SN');
map.set("Somalia", 'SO');
map.set("Suriname", 'SR');
map.set("Sao Tome and Principe", 'ST');
map.set("USSR (former)", 'SU');
map.set("El Salvador", 'SV');
map.set("Syria", 'SY');
map.set("Swaziland", 'SZ');
map.set("Turks and Caicos Islands", 'TC');
map.set("Chad", 'TD');
map.set("French Southern Territories", 'TF');
map.set("Togo", 'TG');
map.set("Thailand", 'TH');
map.set("Tajikistan", 'TJ');
map.set("Tokelau", 'TK');
map.set("Turkmenistan", 'TM');
map.set("Tunisia", 'TN');
map.set("Tonga", 'TO');
map.set("East Timor", 'TP');
map.set("Turkey", 'TR');
map.set("Trinidad and Tobago", 'TT');
map.set("Tuvalu", 'TV');
map.set("Taiwan", 'TW');
map.set("Tanzania", 'TZ');
map.set("Ukraine", 'UA');
map.set("Uganda", 'UG');
map.set("United Kingdom", 'UK');
map.set("US Minor Outlying Islands", 'UM');
map.set("United States", 'US');
map.set("Uruguay", 'UY');
map.set("Uzbekistan", 'UZ');
map.set("Vatican City State (Holy See)", 'VA');
map.set("Saint Vincent & the Grenadines", 'VC');
map.set("Venezuela", 'VE');
map.set("British Virgin Islands", 'VG');
map.set("Virgin Islands (U.S.)", 'VI');
map.set("Viet Nam", 'VN');
map.set("Vanuatu", 'VU');
map.set("Wallis and Futuna Islands", 'WF');
map.set("Samoa", 'WS');
map.set("Kosovo", 'XK');
map.set("Yemen", 'YE');
map.set("Mayotte", 'YT');
map.set("Serbia and Montenegro (former)", 'YU');
map.set("South Africa", 'ZA');
map.set("Zaire", 'ZR');
map.set("Zambia", 'ZM');
map.set("Zimbabwe", 'ZW');


app.get('/', function (req, res) {
    res.render('index.ejs');
})
app.get('/index', function (req, res) {
    res.render('index.ejs');
})

app.get('/userName', function (req, res) {
    var userId = req.query.userId;
    connection.query('SELECT * from users where `userId` = ?', [userId], function (err, rows, fields) {
        if (err) {
            res.status(404).send(err);
        }
        else {
            var firstName = rows[0].firstName;
            var lastName = rows[0].lastName;
            res.send({ firstName: firstName, lastName: lastName })
        }
    })
})


app.get('/profile', requireLogin, function (req, res) {
    var id = req.session.user.userId;
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


app.get('/otherProfile', requireLogin, function (req, res) {
    var id = req.query.userId;
    var currentId = req.session.user.userId;
    var following = false;
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
        },
        function (callback) {
            connection.query('SELECT * from followers where `followee` = ? AND `follower` = ?', [id, currentId], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    if (rows.length === 0)
                        following = false;
                    else
                        following = true;
                    callback(null);
                }
            })
        }
    ],

        function (err, results) {
            if (err) {
                res.status(404).send("Error in adding visited country");
            }
            else
                res.render('profile.ejs', { firstName: firstName, lastName: lastName, userId: id, location: location, profilePic: signedUrl, email: email, currentId: currentId, following: following });
        }

    );
})

function requireLogin(req, res, next) {
    if (!req.user) {
        res.render('index.ejs');
    } else {
        next();
    }
};

app.get('/home', requireLogin, function (req, res) {
    var userId = req.session.user.userId;
    var name;
    var countries;
    var featured = new Array();

    // console.log("session userId = ", userId);
    // console.log("query userId = ", req.query.userId);

    if (parseInt(req.query.userId) !== userId) {
        res.status(403).send("user is not authorized to visit this page");
        return;
    }

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
        function (callback) {
            connection.query('SELECT userId from users where `featured` = ? LIMIT 5', [true], function (err, rows, fields) {
        if (err) {
         callback(err)        
        }
        else
        {
            for(var i = 0;i < rows.length;i++)
            {
                featured.push(rows[i].userId);
            }
            callback(null);
        }
    });
        }
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
                res.render('home.ejs', { name: name, userId: userId, countries: country, favorites: favorites, featured: featured });
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

app.post('/newMessage', function (req, res) {
    var sender = req.body.sender;
    var receiver = req.body.receiver;
    var message = req.body.message;

    connection.query('INSERT INTO chat (sender, receiver, message) VALUES (?, ?, ?)', [sender, receiver, message], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
        else
            res.sendStatus(200);
    });
})


app.get('/getChat', function (req, res) {

    var sender = req.query.sender;
    var receiver = req.query.receiver;
    var messages = new Array();

    connection.query('SELECT * FROM chat WHERE (`sender` = ? AND `receiver` = ?) OR (`sender` = ? AND `receiver` = ?)', [sender, receiver, receiver, sender], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
        else {
            for (var i = 0; i < rows.length; i++) {
                var obj = new Object();
                obj.sender = rows[i].sender;
                obj.receiver = rows[i].receiver;
                obj.message = rows[i].message;
                messages.push(obj);
            }
        }
        res.status(200).send({ messages: messages });
    })
})

app.get('/messages', requireLogin, function (req, res) {
    var userId = req.query.userId;
    var contacts = [];
    var pos = 0;

    async.series([
        function (callback) {
            // do some stuff ...
            connection.query('SELECT follower from followers WHERE `followee` = ?', [userId], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    for (var i = 0; i < rows.length; i++) {
                        contacts[pos++] = JSON.stringify(rows[i].follower);
                    }
                    callback(null);
                }
            });
        },
        function (callback) {
            // do some more stuff ...
            connection.query('SELECT followee from followers WHERE `follower` = ?', [userId], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    for (var i = 0; i < rows.length; i++) {
                        var temp = 0;
                        for (var j = 0; j < contacts.length; j++) {
                            if (JSON.stringify(rows[i].followee) === contacts[j]) {
                                temp = 1;
                                break;
                            }
                        }
                        if (temp === 1)
                            continue;
                        contacts[pos++] = JSON.stringify(rows[i].followee);
                    }
                    callback(null);
                }
            });
        }
    ],
        // optional callback
        function (err, results) {
            if (err) {
                res.status(404).send("Error in getting contacts", err);
            }
            else
                res.render('messages.ejs', { userId: userId, contacts: contacts });
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

app.get('/getFeatured', function (req, res) {

    var userId = req.query.userId;
    var featured = new Array();


    connection.query('SELECT userId from users where `featured` = ? LIMIT 5', [true], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
        else
        {
            for(var i = 0;i < rows.length;i++)
            {
                featured.push(rows[i].userId);
            }
            res.send({ featured: featured });
        }
    });
})

app.post('/addVisited', function (req, res) {

    var country = req.body.country;
    country = map.get(country);
    console.log(map.get(country));

    var userId = req.body.userId;
    var numberCountries = 0;
    var featured = false;

    async.series([
        function (callback) {
            connection.query('SELECT * from countries where `id` = ?', [userId], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else if (rows.length > 0)
                    numberCountries = rows.length;
                callback(null);
            });
        },
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
                else {
                    numberCountries++;
                    callback(null);
                }
            });
        }
    ],
        // optional callback
        function (err, results) {
            if (err) {
                res.status(404).send("Error in adding visited country");
            }
            else {
                if (numberCountries === 5) {
                    featured = true;
                    connection.query('UPDATE users set `featured` = ? where `userId` = ?', [true, userId], function (err, rows, fields) {
                        if (err) {
                            res.status(404).send(err);
                        }
                        else {
                            res.redirect('/home?' + "userId=" + userId + "&featured=" + featured);
                        }
                    });
                    return;
                }
                res.redirect('/home?' + "userId=" + userId);
            }
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

app.post('/addFollowers', function (req, res) {
    var followee = req.body.followee;
    var follower = req.body.follower;

    connection.query('INSERT INTO followers (followee, follower) VALUES (?, ?)', [followee, follower], function (err, rows, fields) {
        if (err) {
            res.sendStatus(404);
        }
    });
})


app.get('/getFollowers', function (req, res) {
    var userId = req.query.userId;
    var followers = [];
    var following = [];

    async.series([
        function (callback) {
            // do some stuff ...
            connection.query('SELECT follower from followers WHERE `followee` = ?', [userId], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    for (var i = 0; i < rows.length; i++) {
                        followers[i] = JSON.stringify(rows[i].follower);
                    }
                    callback(null);
                }
            });
        },
        function (callback) {
            // do some more stuff ...
            connection.query('SELECT followee from followers WHERE `follower` = ?', [userId], function (err, rows, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    for (var i = 0; i < rows.length; i++) {
                        following[i] = JSON.stringify(rows[i].followee);
                    }
                    callback(null);
                }
            });
        }
    ],
        // optional callback
        function (err, results) {
            if (err) {
                res.status(404).send("Error in getting followers");
            }
            else
                res.render('followers.ejs', { followers: followers, userId: userId, following: following });
        });
})

app.post('/removeFollower', function (req, res) {

    var followee = req.body.followee;
    var follower = req.body.follower;

    var followers = [];
    connection.query('DELETE from followers WHERE `followee` = ? AND `follower` = ?', [followee, follower], function (err, rows, fields) {
        if (err) {
            console.log("err in unfollow", err);
            res.sendStatus(404);
        }
        else {
            res.sendStatus(200);
        }
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
                console.log(map.size);
                var i = 0;
                var mapIter = map.keys();
                var countryName;
                for (i = 0; i < map.size; i++) {
                    countryName = mapIter.next().value;
                    if (map.get(countryName) === country) {
                        console.log(i);
                        console.log(countryName);
                        break;
                    }
                }
                res.render('countries.ejs', { userId: userId, country: country, reviews: reviewsWithPics, countryPics: countryPics, countryName: countryName });
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
    var month = req.body.month;
    var numberReviews = 0;
    var featured = false;
    if (cost == "")
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
            connection.query('INSERT into reviews (country, userId, review, rating, private, cost, month) values (?, ?, ?, ?, ?, ?, ?)', [country, userId, text, rating, private, cost, month], function (err, rows, fields) {
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
            
        },
        function (callback) {
            connection.query('SELECT * from reviews WHERE `userId` = ?', userId, function (err, rows, fields) {
                if(err) {
                    callback(err);
                }
                else {
                    numberReviews = rows.length;
                    callback(null);
                }
            });
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
                if(numberReviews == 5)
                {
                     featured = true;
                     connection.query('UPDATE users set `featured` = ? where `userId` = ?', [true, userId], function (err, rows, fields) {
                        if (err) {
                            console.log("error here");
                            res.status(404).send(err);
                        }
                        else {
                            res.redirect('/countries?' + "userId=" + userId + "&country=" + country + "&featured=" + featured);
                        }
                    });   
                    return;                
                }
                res.redirect('/countries?' + "userId=" + userId + "&country=" + country);
            }
        });
})


app.get('/search', function (req, res) {
    var month = req.query.month;
    var country = req.query.country;
    var blank = 0;
    if (country === undefined)
        blank = 1;
    var countries = [];
    var userId = req.query.userId;
    var rating = req.query.rating;
    var min = req.query.min;
    var max = req.query.max;
    var monthFavs = new Array();
    var finalFavs = new Array();
    if (blank === 0) {
        country = map.get(country);
        if (country === undefined) {
            res.render('results.ejs', { countries: [], userId: userId });
            return;
        }
    }

    if (country === "" || country === undefined) {
        if (month !== "" && month !== undefined) {
            connection.query('SELECT * FROM reviews where `month` = ?', [parseInt(month)], function (error, results, fields) {
                if (error) {
                    res.status(404).send(error);
                    return;
                }
                else {
                    for (var i = 0; i < results.length; i++) {
                        var temp = 0;
                        obj = new Object();
                        obj.text = results[i].review;
                        obj.user = results[i].userId;
                        obj.rating = results[i].rating;
                        obj.reviewId = results[i].reviewId;
                        obj.cost = results[i].cost;
                        obj.country = results[i].country;
                        obj.count = 1;
                        for (var i = 0; i < monthFavs.length; i++) {
                            if (obj.country === monthFavs[i].country) {
                                monthFavs[i].count++;
                                monthFavs[i].rating = monthFavs[i].rating + obj.rating;
                                monthFavs[i].cost = monthFavs[i].cost + obj.cost;
                                temp = 1;
                                break;
                            }
                        }
                        if (temp === 0)
                            monthFavs.push(obj);
                    }
                    if (rating === "" || rating === undefined)
                        rating = 0;
                    console.log("min = ", min);
                    console.log("max = ", max);

                    if (min === "")
                        min = 0;

                    if (max === "") {
                        max = Number.MAX_SAFE_INTEGER;
                    }
                    console.log("monthFavs = ", monthFavs);
                    for (var i = 0; i < monthFavs.length; i++) {
                        var averageRating = monthFavs[i].rating / monthFavs[i].count;
                        var averageCost = monthFavs[i].cost / monthFavs[i].count;
                        // console.log(monthFavs[i].count >= 0 );
                        // console.log(averageRating >= parseInt(rating));
                        // console.log(averageCost <= parseInt(max));
                        // console.log(averageCost >= parseInt(min));
                        // console.log(max);

                        if (monthFavs[i].count >= 0 && averageRating >= parseInt(rating) && averageCost <= parseInt(max) && averageCost >= parseInt(min)) {
                            finalFavs.push(monthFavs[i].country);
                        }
                    }
                    console.log("finalFavs = ", finalFavs);
                    res.render('results.ejs', { countries: finalFavs, userId: userId });
                }
            })
        }
        else if (rating !== undefined || min !== "" || max !== "") {
            connection.query('SELECT * from reviews', function (error, results, fields) {
                if (error) {
                    res.status(404).send(error);
                    console.log("error", error);
                    return;
                }
                else {
                    for (var i = 0; i < results.length; i++) {
                        var temp = 0;
                        obj = new Object();
                        obj.text = results[i].review;
                        obj.user = results[i].userId;
                        obj.rating = results[i].rating;
                        obj.reviewId = results[i].reviewId;
                        obj.cost = results[i].cost;
                        obj.country = results[i].country;
                        obj.count = 1;
                        for (var j = 0; j < monthFavs.length; j++) {
                            if (obj.country === monthFavs[j].country) {
                                monthFavs[j].count++;
                                monthFavs[j].rating = monthFavs[j].rating + obj.rating;
                                monthFavs[j].cost = monthFavs[j].cost + obj.cost;
                                temp = 1;
                                break;
                            }
                        }
                        if (temp === 0)
                            monthFavs.push(obj);
                    }
                    if (rating === undefined || rating === "")
                        rating = 0;
                    if (min === "")
                        min = 0;
                    if (max === "")
                        max = Number.MAX_SAFE_INTEGER;
                    console.log("monthFavs = ", monthFavs);
                    for (var i = 0; i < monthFavs.length; i++) {
                        var averageRating = monthFavs[i].rating / monthFavs[i].count;
                        var averageCost = monthFavs[i].cost / monthFavs[i].count;
                        if (averageRating >= parseInt(rating) && averageCost <= parseInt(max) && averageCost >= parseInt(min)) {
                            finalFavs.push(monthFavs[i].country);
                        }
                    }
                    console.log("finalFavs = ", finalFavs);
                    res.render('results.ejs', { countries: finalFavs, userId: userId });
                }
            })
        }
    }
    else {
        console.log("country = ", country);
        res.redirect('/countries?' + "userId=" + userId + "&country=" + country);
        return;
    }
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

