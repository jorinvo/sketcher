var fs = require('fs');
var crypto = require('crypto');
var express = require('express');
var hbs = require('hbs');
var GridStream = require('GridFS').GridStream;

var config = require('./config');


var app = express();

app.set('view engine', 'hbs');
app.set('views', config.viewsDir);
app.use(express.bodyParser());
app.use(express.limit(config.sizeLimit));
app.use(express.static(config.publicDir));


function loadPartial (name) {
	return fs.readFileSync(config.viewsDir + '/partials/' + name + '.hbs', { encoding: 'utf-8'});
}

hbs.registerPartial('header', loadPartial('header'));
hbs.registerPartial('footer', loadPartial('footer'));


app.get('/', function (req, res) {
	res.redirect('/sketches/create');
});

app.get('/sketches/create', function (req, res) {
	res.render('create');
});

app.get('/sketches/:id', function (req, res) {

	var id = req.params.id;

	res.render('sketch',  {
		sketch: id
	});

});

app.post('/sketches/create', function (req, res) {

	var id = crypto.randomBytes(10).toString('hex');

	// args: dbname, filename, mode, options
	var file = GridStream.createGridWriteStream(
		config.dbName,
		id + '.' + config.imageFormat,
		'w',
		{ root: config.fileCollection }
	);

	var data = new Buffer(req.body.data, 'base64');
	file.end(data);

	var sketchUrl = config.sketchesUrl + '/' + id;
	res.end(sketchUrl);

});

app.get('/images/:name', function (req, res) {
	var name = req.params.name;

	// args: dbname, filename, options
	var file = GridStream.createGridReadStream(
		'sketcher',
		name,
		{ root: config.fileCollection }
	);

	file.pipe(res);
});

// nothing found
app.use(function(req, res, next){
	res.redirect('/sketches/create');
});


app.listen(config.port);
console.log('app is running at: http://localhost:' + config.port);