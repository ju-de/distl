function getSummary() {

	var oldLength = 200;
	var summary = "Lorem ipsum dolor sit amet, ne duo modo convenire facilisis, no eam scaevola principes laboramus. Sea an possit ancillae. Accusam consequat ius te, vidit oratio labitur eos an. Tamquam singulis ei nam, no pro verterem dissentias. Et cum idque labore omnesque, eros nihil eum ex. Lorem ipsum dolor sit amet, ne duo modo convenire facilisis, no eam scaevola principes laboramus. Sea an possit ancillae. Accusam consequat ius te, vidit oratio labitur eos an. Tamquam singulis ei nam, no pro verterem dissentias. Et cum idque labore omnesque, eros nihil eum ex. Lorem ipsum dolor sit amet, ne duo modo convenire facilisis, no eam scaevola principes laboramus. Sea an possit ancillae. Accusam consequat ius te, vidit oratio labitur eos an. Tamquam singulis ei nam, no pro verterem dissentias. Et cum idque labore omnesque, eros nihil eum ex. Lorem ipsum dolor sit amet, ne duo modo convenire facilisis, no eam scaevola principes laboramus. Sea an possit ancillae. Accusam consequat ius te, vidit oratio labitur eos an. Tamquam singulis ei nam, no pro verterem dissentias. Et cum idque labore omnesque, eros nihil eum ex. Lorem ipsum dolor sit amet, ne duo modo convenire facilisis, no eam scaevola principes laboramus. Sea an possit ancillae. Accusam consequat ius te, vidit oratio labitur eos an. Tamquam singulis ei nam, no pro verterem dissentias. Et cum idque labore omnesque, eros nihil eum ex. Lorem ipsum dolor sit amet, ne duo modo convenire facilisis, no eam scaevola principes laboramus. Sea an possit ancillae. Accusam consequat ius te, vidit oratio labitur eos an. Tamquam singulis ei nam, no pro verterem dissentias. Et cum idque labore omnesque, eros nihil eum ex.";
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

function thumbsUp() {

	document.getElementById('up').style.color = "#7DB4B5";
	document.getElementById('down').disabled = true;

}

function thumbsDown() {

	document.getElementById('down').style.color = "#7DB4B5";
	document.getElementById('up').disabled = true;

}

window.onload = function() {

  getSummary();
  document.getElementById("copy").addEventListener("click", onCopy);
  document.getElementById("up").addEventListener("click", thumbsUp);
  document.getElementById("down").addEventListener("click", thumbsDown);

}