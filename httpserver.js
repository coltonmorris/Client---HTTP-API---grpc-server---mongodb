/*
NOTES:
client connects to http server -> client sends ajax request -> 

*/
// Retrieve
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var assert = require('assert');
var restify = require('restify');

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://localhost/exampleDb');

//define model. It represnets a colleciton.
var Name = mongoose.model('Name', {first: String, last: String});

var server = restify.createServer();

//use bodyParser middleware for JSON
server.use(restify.bodyParser());

//server index.html file
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

//http post handler
server.post('/my_post',function(req,res,next){ 
    // Get the first_name value from the POSTed data
    if (req.body.first == ''){
	res.send(200);
	next();
    }
    else{
	//console.log(req.body);
	var first_name = req.body.first;
	var person = new Name({first:first_name,last:"MORRIS"});
	person.save(function(err,data){
		if (err) console.log(err);
		else console.log("saved: " + data);
	});	
	
	
	// Send back the value they posted
	res.send("You posted a first name of " + first_name);
	next();
    }
});
//post request that returns the list of people from our db
//database <- grpc server <- restify server <- client
server.post('/people',function(req,res,next){
	//Find every person from the Name collection
	var promise = Name.find({}).exec().then(function(user){
		res.send(user);
		next();
		//for (var i in user){
		//	console.log(user[i].first);
		//};
	});
});

//have server listen on port 8080
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

