//server
var PROTO_PATH = __dirname + '/main.proto';
var grpc = require('grpc');
var people_proto = grpc.load(PROTO_PATH).people;
//mongoose
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

//Lets connect to our mongodb database using the DB server URL.
mongoose.connect('mongodb://localhost/exampleDb');

//define Name model. It represnets a colleciton.
var Name = mongoose.model('Name', {first: String, last: String});

/**
 * Implements the WritePerson RPC method.
 */
function writePerson(call, callback) {
	console.log("in grpc server's writePerson heres the call: ",call);
	var person = new Name({first:call.request.first,last:"MORRIS"});
	person.save(function(err,data){
	if (err) console.log(err);
	else console.log("saved: " + data);
	});	

	//callback(null, {message: 'Hello ' + call.request.name});
	//callback(err,response)
	callback(null, {msg: 'successful'});
}
/**
 * Implements the GetPersons RPC method
 */
function getPersons(call, callback){
	//console.log("in here too");
	//Find every person from the Name collection
	var promise = Name.find({}).exec().then(function(user){
		//console.log(user);
		//for (var i in user){
			//returning a stream
			callback(null,{first:user[0].first});
		//};
	});
}

/**
 * Starts an RPC server that receives requests for the Writer service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addProtoService(people_proto.Writer.service, {writePerson: writePerson});
  server.addProtoService(people_proto.Getter.service, {getPersons: getPersons});
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
