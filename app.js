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
	console.log("\n");
	// var temp = ". ";
	// var numSentences = (temp.match(/is/g) || []).length;
	// var numSentences = 5;
	// console.log(numSentences);
	var responseData;

	SummaryTool.summarize("", req.body.data, function(err, summary) {

		    if(err) console.log("Something went wrong man!");

		    console.log(summary);
		    responseData = summary;

		    console.log("Original Length " + (req.body.data.length));
		    console.log("Summary Length " + summary.length);
		    console.log("Summary Ratio: " + (100 - (100 * (summary.length / (req.body.data.length)))));
		});

	analyzeSentimentFromString(req.body.data, {type:"text", language:"en"}, function(something, sentiment) {
		console.log(sentiment);
		analyzeEntitiesFromString(req.body.data, {type:"text", language:"en"}, function(something, entities) {
			var senti;
			if (sentiment.polarity < 0) senti = "negative";
			else if (sentiment.polarity == 0) senti = "neutral";
			else senti = "positive";

			console.log(entities);

			var ent = {}

			for (entityType in entities){
				if (entities.hasOwnProperty(entityType)) {
					var temp = [];
					for (i = 0; i < entities[entityType].length; ++i){
						temp.push(entities[entityType][i].name)
					}
					ent[entityType] = temp;
				};
			}


			console.log(senti);
			console.log(ent);
			var reqID = makeid();
			console.log(reqID);
			cache[reqID] = {result: responseData, content: req.body.data, url: req.body.url, entities: ent};
			setTimeout(function () {
				delete cache[reqID];
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~deleted " + reqID);
			}, 600000);
			
			res.send({
				reqID: reqID,
				result: responseData,
				sentiment: senti,
				entities: ent
			});
		});
	});
});

app.post('/upvote', function(req, res) {
	fs.stat('log.txt', function(err, stat) {
	    if(err == null) {
	        console.log('File exists');
	    } else if(err.code == 'ENOENT') {
	        // file does not exist
	        console.log("File doesn't exist")
	        fs.writeFile('log.txt', '');
	    } else {
	        console.log('Some other error: ', err.code);
	    }
	    var entityArr = [];
    	for (entityType in cache[req.body.reqID].entities) {
    		if (cache[req.body.reqID].entities.hasOwnProperty(entityType)) {
    			entityArr = entityArr.concat(cache[req.body.reqID].entities[entityType]);
    		};
    	}
        var appendData = moment().format() + "||" 
        				+ cache[req.body.reqID].url + "||" 
        				+ cache[req.body.reqID].url + "||" 
        				+ cache[req.body.reqID].content+ "||" 
        				+ "POS" + "||" 
        				+ cache[req.body.reqID].responseData + "||" + 
        				+ entityArr.join(",") + "\n";
        console.log(appendData);
        fs.appendFile('log.txt', appendData, function (err) {});
	    res.send();
	});
});

app.post('/downvote', function(req, res) {
	fs.stat('log.txt', function(err, stat) {
	    if(err == null) {
	        console.log('File exists');
	    } else if(err.code == 'ENOENT') {
	        // file does not exist
	        console.log("File doesn't exist")
	        fs.writeFile('log.txt', '');
	    } else {
	        console.log('Some other error: ', err.code);
	    }
	    var entityArr = [];
    	for (entityType in cache[req.body.reqID].entities) {
    		if (cache[req.body.reqID].entities.hasOwnProperty(entityType)) {
    			entityArr = entityArr.concat(cache[req.body.reqID].entities[entityType]);
    		};
    	}
        var appendData = moment().format() + "||" 
        				+ cache[req.body.reqID].url + "||" 
        				+ cache[req.body.reqID].url + "||" 
        				+ cache[req.body.reqID].content+ "||" 
        				+ "NEG" + "||" 
        				+ cache[req.body.reqID].responseData + "||" + 
        				+ entityArr.join(",") + "\n";
        console.log(appendData);
        fs.appendFile('log.txt', appendData, function (err) {});
	    res.send();
	});
});

var j = schedule.scheduleJob('0 0 * * *', function(){
  console.log('Logging now');

  run_cmd("gsutil", ["cp", "log.txt", "gs://distl-logs/"+ moment.format("YYYY") + "/" + moment.format("MM") + "/" + moment.format("DD-MM-YYYY")], 
  	function () {
  		fs.writeFile('log.txt', '');
  	});
});


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_~";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
