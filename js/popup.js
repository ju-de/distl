function makeExtractRequest(url, callback) {
  var fullUrl = "http://boilerpipe-web.appspot.com/extract?url=" + url + "?extractor=ArticleExtractor&output=text";
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", fullUrl, true);
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4) {
      callback(xmlHttp.responseText, xmlHttp.status);
    }
  }
  xmlHttp.send();
}

function onTextExtracted(response, statusCode) {
  console.log(statusCode);
  console.log(response);
}

document.addEventListener('DOMContentLoaded', function() {
  makeExtractRequest("http://waitbutwhy.com/2016/09/marriage-decision.html", onTextExtracted);
});