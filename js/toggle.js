function toggleHover() {

	// console.log(localStorage);

	// if ( localStorage.hover == 'undefined' )
	// 	localStorage.hover;

	// else
	// 	localStorage.hover = !localStorage.hover;


	// console.log(localStorage.hover);
	var toggle = document.getElementById('hover');
	toggle.checked = !toggle.checked;
	console.log(toggle.checked);

}

window.onload = function() {

  document.getElementById('hover').addEventListener("click", toggleHover);

}