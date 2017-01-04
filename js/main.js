'use strict'

/**
 * This file ties together any connections that need to be made.
 */

document.addEventListener("DOMContentLoaded", function() {
	// Attach the trackMouse function to the document
	document.onmousemove = whiteboard.trackMouse;
	// Attach the whiteboard resize event to onload and onresize
	window.onload = whiteboard.resize;
	window.resize = whiteboard.resize;

	// Initialize the palette
	palette.init();
});