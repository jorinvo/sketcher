var url = require('url');


var config = {

	port: process.env.PORT || 3000,
	viewsDir: __dirname + '/views',
	publicDir: __dirname + '/public',
	sizeLimit: '5mb',
	imageFormat: 'png',
	dbName: 'sketcher',
	fileCollection: 'pictures',
	sketchesUrl: 'http://localhost:3000/sketches'

};


// GridFS config:

var mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;

if (mongoUrl) {
	var components = url.parse(mongoUrl);
	process.env.MONGO_NODE_DRIVER_HOST = components.auth + '@' + components.hostname;
	process.env.MONGO_NODE_DRIVER_PORT = components.port;
}


module.exports = config;