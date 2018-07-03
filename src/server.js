var app = require("./app")
var config = require('../config.js');

app.listen(config.port, function(){
	console.log("Listening on http://127.0.0.1:" + config.port)
});