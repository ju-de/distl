var express = require('express');
var http = require('http').Server(app);
var request = require("request")

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  res.status(200).send('Hello, world!');
});

app.use('/home', express.static('index.html'));
app.use(express.static(__dirname + '/'));

// Start the server
var server = app.listen(process.env.PORT || '8080', function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});
// [END app]


app.post('/distl', function(req, res) {
	console.log(req.body);
	console.log("hi");
	res.send();
});