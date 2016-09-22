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
app.use(express.static(path.join(__dirname, 'public')));
app.get('/index', function (req, res) {
   res.sendFile( __dirname + "/public/" + "index.html" );
})

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})
