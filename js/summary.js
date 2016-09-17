function getSummary() {

	var oldLength = 100;
	var summary = "text goes here";
	var newLength = summary.length;

	console.log(oldLength, summary, newLength);

	document.querySelector('.content .oldLength').innerHTML = oldLength;
	document.querySelector('.content .newLength').innerHTML = newLength;
	document.getElementById('summary').value = summary;
}