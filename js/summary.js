var oldLength = 0;

function makeExtractRequest(url, callback) {
  var fullUrl = "http://boilerpipe-web.appspot.com/extract?url=" + url + "&extractor=ArticleExtractor&output=htmlFragment";
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", fullUrl, true);
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4) {
      callback(xmlHttp.responseText, xmlHttp.status, url);
    }
  }
  xmlHttp.send();
}


function onTextExtracted(response, statusCode, srcUrl) {

  oldLength = (response.match(/\w[.?!](\s|$)/g) || []).length;

  console.log("Status: " + statusCode);
  console.log("\n\nSource text:\n\n" + response);
  var processedText = extract(response);
  console.log("\n\nProcessed text:\n\n" + processedText);

  var textBox = document.getElementById('summary');
  textBox.innerHTML = processedText;
  processedText = textBox.textContent;
  textBox.textContent = "";

  makeSummarizeRequest(processedText, onSummarizeResponse, srcUrl);
}

function makeSummarizeRequest(processedText, callback, srcUrl) {
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
    "url": srcUrl,
    "data": processedText
  }));
}

function onSummarizeResponse(response, statusCode) {
  console.log("\n\nSummary request status: " + statusCode);
  console.log("\n\nSummary request result:\n\n" + response);
  response = response.replace(/\\n/g,'\\n\\n');
  // compress extra newlines
  response = response.replace(/(\\r\\n|\\r|\\n){2,}/g, '$1\\n');
  // remove leading and trailing newlines 
  response = response.replace(/^\\n+|\\n+$/g,'');
  // strip "Title" at beginning just in case
  response = response.replace(/Title\\n\\n/g,'');
  console.log("\n\nStripped result:\n\n" + response);

  var jsonResponse = JSON.parse(response);
  getSummary(jsonResponse.result);
}

function getSummary(summary) {

	var newLength = (summary.match(/\w[.?!](\s|$)/g) || []).length;

	// set length stats
  document.getElementById('lengths').innerHTML = "Shortened from " + oldLength + " lines to " + newLength + ".";
	document.getElementById('rate').innerHTML = "Was that a good summary?" ;

  // show buttons
  document.getElementById("copy").style.display = "inline";
  document.getElementById("up").style.display = "inline";
  document.getElementById("down").style.display = "inline";

  document.getElementById("summary").style.display = "block";

	// set summary output
  document.body.innerHTML = document.body.innerHTML.replace('<div class="loading"><i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i></div>', '');
  
	document.getElementById('summary').value = summary;

}

function onCopy() {

  console.log("copy");
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

  // setup buttons
  $(document).on("click", "#copy", onCopy);
  $(document).on("click", "#up", thumbsUp);
  $(document).on("click", "#down", thumbsDown);

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