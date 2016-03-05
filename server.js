var express 		= require('express');
var app				= express();
var mongoose	 	= require('mongoose');
var morgan			= require('morgan');
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override')

// Configuration section

mongoose.connect('mongodb://localhost/myapp');
// mongoose.connect('mongodb://admin:admin@olympia.modulusmongo.net:27017/eQityp8o');
// mongoose.connect('mongodb://admin:admin@127.0.0.1:27107/test');

mongoose.connection.on('error', function (err) {
	console.log("Error: " + err);
});

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json '}));
app.use(methodOverride());

// Todo model
var Todo = mongoose.model('Todo', {
	text: String
});

/* ROUTES */

// Get all todos
app.get('/api/todos', function(req, res) {
	Todo.find(function(err, todos) {
		if (err)
			res.send(err);

		res.json(todos);
	});
});

// Create todo and send back all todos after creating
app.post('/api/todos', function(req, res) {
	Todo.create({
		text : req.body.text,
		done: false
	}, function(err, todo) {
		if (err)
			res.send(err);

		// Get and return all todos after creating
		Todo.find(function(err, todos) {
			if (err)
				res.send(err);
			res.json(todos);
		});
	});
});

// Delete todo
app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after deleting one
		Todo.find(function(err, todos) {
			if (err)
				res.send(err);
			res.json(todos);
		});
	});
});

// Home
app.get('', function(req, res) {
	res.sendfile('./public/index.html');
});

// Listen section
app.listen(8080);
console.log("App listening on port 8080");