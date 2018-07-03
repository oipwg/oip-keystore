var rimraf = require('rimraf');

try {
	rimraf(__dirname + "/db.json", function(){})
	rimraf(__dirname + "/../db.json", function(){})
} catch (e) {}