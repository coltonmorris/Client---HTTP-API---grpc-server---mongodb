var express = require('express');
var path = require('path');


//Express serving files
var app = express();

// Define the port to run on
app.set('port', 8080);

//enable cors for ajax requests using dataType: jsonp
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//serve file
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});





//function respond(req, res, next) {
//  res.send('hello ' + req.params.name);
//  next();
//}
//
//var server = restify.createServer();
//server.get('/hello/:name', respond);
//server.head('/hello/:name', respond);
//
//server.listen(8080, function() {
//  console.log('%s listening at %s', server.name, server.url);
//});

//example curl call
// curl -is http://localhost:8080/hello/mark -H 'accept: text/plain'
