function getSummary() {

	var oldLength = 200;
	var summary = "Summary goes here.";
	var newLength = summary.length;

	// set length stats
	document.querySelector('.content .lengths .oldLength').innerHTML = oldLength;
	document.querySelector('.content .lengths .newLength').innerHTML = newLength;

	// set summary output
	document.getElementById('summary').value = summary;

}

function onCopy() {

	document.getElementById('summary').select();
	document.execCommand('copy');

}

window.onload = function() {

  getSummary();
  document.getElementById("copy").addEventListener("click", onCopy);

}