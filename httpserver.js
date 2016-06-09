//database <- grpc server <- restify server <- client
var assert = require('assert');
var restify = require('restify');
//grpc
var PROTO_PATH = __dirname + '/main.proto';
var grpc = require('grpc');
var people_proto = grpc.load(PROTO_PATH).people; //.people is the package/namespace


var server = restify.createServer();

//use bodyParser middleware for JSON
server.use(restify.bodyParser());

//server index.html file
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

//post request that writes a person to the db
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
		res.send("You posted a first name of " + first_name);
		next();
	});
    }
});
//post request that returns the list of people from our db
server.post('/people',function(req,res,next){
	//run this with an async.series? 
	var promise = new Promise(function(resolve,reject){
		var client2 = new people_proto.Getter('localhost:50051',
							grpc.credentials.createInsecure());

		var fakePerson = {
			first: "nothin"
		};
		var call = client2.getPersons(fakePerson);
		var users = [];
		call.on('data',function(person){
			users.push(person);
			
		});
		call.on('end', function(){
			resolve(users);
		});
	}).then(function(users){
		//when we have recieved all our data, send it all to the client/browser
		res.send(users);
		next();
	});
		
});
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

