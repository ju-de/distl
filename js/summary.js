function makeExtractRequest(url, callback) {
  var fullUrl = "http://boilerpipe-web.appspot.com/extract?url=" + url + "&extractor=ArticleExtractor&output=htmlFragment";
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "http://www.example.com", true);
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4) {
      callback(xmlHttp.responseText, xmlHttp.status);
    }
  }
  xmlHttp.send();
}

function onTextExtracted(response, statusCode) {
  console.log("Status: " + statusCode);
  console.log("\n\nSource text:\n\n" + response);
  var processedText = extract(response);
  console.log("\n\nProcessed text:\n\n" + processedText);

  var textBox = document.getElementById('hidden');
  textBox.innerHTML = processedText;
  processedText = textBox.textContent;
  textBox.textContent = "";

  makeSummarizeRequest(processedText, onSummarizeResponse);
}

function makeSummarizeRequest(processedText, callback) {
  var url = "https://hackthenorth16-1505.appspot.com/distl"
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", url, true);
  xmlHttp.setRequestHeader("Content-Type", "application/json");
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4) {
      callback(xmlHttp.responseText, xmlHttp.status);
    }
  }
  xmlHttp.send(JSON.stringify(
  {
    "url": "test",
    "text": processedText
  }));
}

function onSummarizeResponse(response, statusCode) {
  console.log("\n\nSummary request status: " + statusCode);
  console.log("\n\nSummary request result:\n\n" + response);
  var jsonResponse = JSON.parse(response);
  getSummary(jsonResponse.text);
}

function getSummary(summary) {

	var oldLength = 200;
	var newLength = (summary.match(/\n/g) || []).length;

	// set length stats
  document.getElementById('lengths').innerHTML = "Shortened from " + oldLength+ " lines to " + newLength + ".";
	document.getElementById('rate').innerHTML = "Was that a good summary?" ;

  // setup button
  document.body.innerHTML = document.body.innerHTML.replace('?</span>',
                                                            '?</span><button id="up"><i class="fa fa-thumbs-up"></i></button><button id="down"><i class="fa fa-thumbs-down"></i></button><button class="copy" id="copy"><i class="fa fa-clipboard"></i></button>');

  document.getElementById("copy").addEventListener("click", onCopy);
  document.getElementById("up").addEventListener("click", thumbsUp);
  document.getElementById("down").addEventListener("click", thumbsDown);

	// set summary output
  document.body.innerHTML = document.body.innerHTML.replace('<div class="loading"><i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i></div>',
                                                            '<textarea id="summary" readonly></textarea>');
  
	document.getElementById('summary').value = summary;

}

function onCopy() {

	document.getElementById('summary').select();
	document.execCommand('copy');

}

function thumbsUp() {

	document.getElementById('up').style.color = "#7DB4B5";
	document.getElementById('down').disabled = true;

}

function thumbsDown() {

	document.getElementById('down').style.color = "#7DB4B5";
	document.getElementById('up').disabled = true;

}

window.onload = function() {
  chrome.tabs.query(
    {
        active: true,
        currentWindow: true
    },
    function(tabs) {
        var currentUrl = tabs[0].url;
        makeExtractRequest(currentUrl, onTextExtracted);
    });
}