var url = require('url');


var config = {

	port: process.env.PORT || 3000,
	viewsDir: __dirname + '/views',
	publicDir: __dirname + '/public',
	sizeLimit: '5mb',
	imageFormat: '.png'

};

var mongo = {};

var mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/sketcher';
var components = url.parse(mongoUrl);
var auth = components.auth ? components.auth.split(':') : [];

mongo.host =  components.hostname;
mongo.port =  components.port;
mongo.dbname =  components.pathname.replace('/', '');
mongo.user =  auth[0];
mongo.pass =  auth[1];

config.mongo = mongo;

module.exports = config;