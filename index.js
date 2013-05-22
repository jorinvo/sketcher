var fs = require('fs');
var crypto = require('crypto');
var express = require('express');
var hbs = require('hbs');
var mongodb = require('mongodb');

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

	hasFile(id + config.imageFormat, function (err, exist) {
		if (exist) {
			res.render('sketch',  {
				sketch: id
			});
		} else {
			res.redirect('/');
		}
	});

});

app.post('/sketches/create', function (req, res) {

	var id = crypto.randomBytes(10).toString('hex');

	var data = new Buffer(req.body.data, 'base64');

	storeFile(id + config.imageFormat, data, function () {

		var sketchUrl = '/sketches/' + id;
		res.end(sketchUrl);

	});


});

app.get('/images/:name', function (req, res) {
	var name = req.params.name;
	getFile(name, function (err, stream) {
		stream.pipe(res);
	});
});

// nothing found
app.use(function(req, res, next){
	res.redirect('/sketches/create');
});


app.listen(config.port);
console.log('app is listening on port: ' + config.port);



function storeFile (name, data, cb) {
	connect(name, 'w', function (err, gs) {
		gs.write(data, function (err, res) {
			// console.log('e: ', err)
			console.log('r: ', res)
		});
		gs.close(cb);
	});
}

function getFile (name, cb) {
	connect(name, 'r', function (err, gs) {
		cb(err, gs.stream(true));
	});
}

function hasFile (name, cb) {
	connect(name, 'r', function (err, gs, db) {
		mongodb.GridStore.exist(db, name, cb);
	});
}

function connect (file, mode, cb) {
	var server = new mongodb.Server(config.mongo.host, config.mongo.port, {});
	var db = new mongodb.Db(config.mongo.dbname, server, { w: 1 });
	var gs = new mongodb.GridStore(db, file, mode, { "content_type": "image/png" });
	db.open(function (err, client) {
		if (config.mongo.user) {
			client.authenticate(config.mongo.user, config.mongo.pass, function (err) {
				gs.open(function (err, gs) {
					cb(err, gs, db);
				});
			});
		} else {
			gs.open(function (err, gs) {
				cb(err, gs, db);
			});
		}
	});
}