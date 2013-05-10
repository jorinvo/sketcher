// use MONGO_NODE_DRIVER_HOST and MONGO_NODE_DRIVER_PORT env vars to for GridFS

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


module.exports = config;