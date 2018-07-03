var app = require("./app")

app.listen(config.port, function(){
	console.log("Listening on http://127.0.0.1:" + config.port)
});