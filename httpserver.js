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
//grpc
var PROTO_PATH = __dirname + '/main.proto';
var grpc = require('grpc');
var people_proto = grpc.load(PROTO_PATH).people; //.people is the package/namespace

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
	//call to grpc to add person to db
	//Writer is our service
	var client = new people_proto.Writer('localhost:50051',
						grpc.credentials.createInsecure());
	
	var first_name = req.body.first;
	client.writePerson({first:first_name},function(err,response){
		if  (err) { console.log("error in writing person");}
		//writing person is successful
		console.log(response.msg, ' write person');
		res.send("You posted a first name of " + first_name);
		next();
	});

//	var person = new Name({first:first_name,last:"MORRIS"});
//	person.save(function(err,data){
//		if (err) console.log(err);
//		else console.log("saved: " + data);
//	});	
//	
//	
//	// Send back the value they posted
//	res.send("You posted a first name of " + first_name);
//	next();
    }
});
//post request that returns the list of people from our db
//database <- grpc server <- restify server <- client
server.post('/people',function(req,res,next){
	var client = new people_proto.Getter('localhost:50051',
						grpc.credentials.createInsecure());
	var p1 = new Promise(function(resolve,reject){
		console.log("in promise");
		resolve();
		//this function isnt getting called???
		client.getPersons({first:"empty"},function(err,response){
			if (err) {
				console.log("error in getting persons");
				reject();
			}
			//getting persons was successful
			console.log(response.first," is the persons name");
			resolve();
		});
	}).then(function(){
		console.log("in then");
		//Find every person from the Name collection
		var promise = Name.find({}).exec().then(function(user){
			res.send(user);
			next();
			//for (var i in user){
			//	console.log(user[i].first);
			//};
		});
	});
		
});

//have server listen on port 8080
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

