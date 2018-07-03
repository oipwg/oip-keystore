// Import express as webserver connection
var express = require('express');
// Import other express assets needed to parse JSON from POST's
var bodyParser = require('body-parser');
var multer = require('multer');

// Import lowdb for database handling
const low = require('lowdb')
// FileSync will provide us with a way to save our db to a file
const FileSync = require('lowdb/adapters/FileSync')

var AccountProcessor = require("./AccountProcessor.js");
var config = require('../config.js');

// Here we setup the db file
const adapter = new FileSync('db.json')
// And again, finishing the db setup
const db = low(adapter);

// Setup database defaults
db.defaults({ accounts: [] }).write();


var getIdentifier = function(req){
	var identifier;

	if (req.body && req.body.identifier)
		identifier = req.body.identifier

	if (!identifier && req.params && req.params.identifier)
		identifier = req.params.identifier

	return identifier
}

var getIP = function(req){
	return req.headers['x-forwarded-for'] || req.connection.remoteAddress
}

// Start up the "app" (webserver)
var app = express()

// Setup middleware
// for parsing multipart/form-data
var upload = multer();
// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// CORS stuff
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Listen to connections on "http://faucet:port/"
// Respond with a status of being online.
app.get('/', function(req, res){
	res.send({
		status: "online"
	});
})

app.post('/create', upload.array(), function(req, res){
	var account = new AccountProcessor(db);

	var email;

	if (req.body && req.body.email)
		email = req.body.email

	var ip = getIP(req);

	res.send(account.create(ip, email))
})

app.get('/checkload/:identifier', function(req, res){
	var account = new AccountProcessor(db);

	var identifier = getIdentifier(req);

	res.send(account.checkload(identifier))
})

app.get('/load/:identifier', function(req, res){
	var account = new AccountProcessor(db);

	var identifier = getIdentifier(req);

	res.send(account.load(identifier))
})

app.post('/update', upload.array(), function(req, res){
	var account = new AccountProcessor(db);

	var identifier = getIdentifier(req);
	var ip = getIP(req);
	var encrypted_data
	var shared_key

	if (req.body && req.body.encrypted_data)
		encrypted_data = req.body.encrypted_data

	if (req.body && req.body.shared_key)
		shared_key = req.body.shared_key

	res.send(account.update(ip, identifier, encrypted_data, shared_key))
})

app.listen(config.port, function(){
	console.log("Listening on http://127.0.0.1:" + config.port)
});