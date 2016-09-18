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
  getSummary(response);
}

function getSummary(summary) {

	var oldLength = 200;
	var newLength = summary.length;

	// set length stats
	document.querySelector('.content .lengths .oldLength').innerHTML = oldLength;
	document.querySelector('.content .lengths .newLength').innerHTML = newLength;

	// set summary output
	document.getElementById('summary').value = summary;

}

function onCopy() {

	window.close();

}

window.onload = function() {
  document.getElementById("copy").addEventListener("click", onCopy);
  makeExtractRequest("http://waitbutwhy.com/2016/09/marriage-decision.html", onTextExtracted);
}