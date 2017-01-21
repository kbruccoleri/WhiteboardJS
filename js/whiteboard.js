/**
 * whiteboard.js
 *
 * The whiteboard class contains all means needed for storage of the canvas object
 * and all modifications made to it.
 */

'use strict'

var whiteboard = whiteboard || {};

/**
 * whiteboard.canvasID
 * 
 * The canvas is identified using a hash code.
 *
 * @type {String}
 */
whiteboard.canvasID = "MxB4c";

/**
 * whiteboard.modes
 *
 * An enum that represents the different action modes possible with the whiteboard.
 * "DRAW" is to using a brush tool, as "ERASE" is to using an eraser.
 * 
 * @type {Enum}
 */
whiteboard.modes = Enum("DRAW", "ERASE");

whiteboard.currentMode = whiteboard.modes.DRAW;

/**
 * whiteboard.canvas
 * 
 * The actual canvas HTML element straight from the DOM.
 * @type {HTML element}
 */
whiteboard.canvas = document.getElementById("whiteboard");

/**
 * whiteboard.lastDrawnPoint
 *
 * We store the last drawn point, that way we can interpolate between the individual dots.
 * Originally is initialized off screen
 *
 * @type {Point}
 */
whiteboard.lastDrawnPoint = new Point(-999, -999);

/**
 * whiteboard.isInStroke
 *
 * We store whether or not the user is currently dragging the cursor across the whiteboard. If so,
 * this allows us to identify whether or not to fill in the gaps between various points detected.
 *
 * @type {Boolean}
 */
whiteboard.isInStroke = false;

/**
 * whiteboard.trackMouse
 *
 * This function is called whenever the cursor is moved.
 */
whiteboard.trackMouse = function(event) {
	var dot, 
		eventDoc, 
		doc, 
		body, 
		pageX, 
		pageY;

	// IE compatibility
	event = event || window.event;

	// If pageX/Y aren't available and clientX/Y are,
		// calculate pageX/Y - logic taken from jQuery.
		// (This is to support old IE)
		if (event.pageX == null && event.clientX != null) {
				eventDoc = (event.target && event.target.ownerDocument) || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = event.clientX +
					(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
					(doc && doc.clientLeft || body && body.clientLeft || 0);
				event.pageY = event.clientY +
					(doc && doc.scrollTop  || body && body.scrollTop  || 0) -
					(doc && doc.clientTop  || body && body.clientTop  || 0 );
		}

		// event.which is a 0/1 value; 1 when mouse is pressed, 0 otherwise.
		if (event.which == 1) {
			if (whiteboard.currentMode === whiteboard.modes.DRAW) {
				brush.drawStroke([new Point(event.pageX, event.pageY)]);
			}
			else if (whiteboard.currentMode === whiteboard.modes.ERASE) {
				// Pass through a customized version of the canvas context
				var ctx = whiteboard.canvas.getContext("2d");
				ctx.globalCompositeOperation = "destination-out";
				// Utilize the brush drawStroke function, but also along with the customized context object.
				brush.drawStroke([new Point(event.pageX, event.pageY)], ctx);
			}
			// Take note that the most recent event was a mousepress
			whiteboard.isInStroke = true;
		}
		else {
			// Take note that the most recent event was not a mousepress
			whiteboard.isInStroke = false;
		}
};

/**
 * whiteboard.resize
 *
 * This function is intended to be called for window's onload and resize events.
 */

whiteboard.resize = function() {
	// Inherit the dimensions of the window.
	whiteboard.canvas.width = window.innerWidth;
	whiteboard.canvas.height = window.innerHeight;
}

/**
 * whiteboard.setCurrent Mode
 * 
 * @param {whiteboard.modes enum} newMode 	The new mode we are setting the whiteboard to.
 * @return {Boolean}						True if successful, false otherwise.
 */
whiteboard.setCurrentMode = function(newMode) {
	for (var mode in whiteboard.modes.all) {
		if (mode == newMode) {
			// We have found a match between the input and the mode enum. Set it and return true.
			whiteboard.currentMode = helper.toInteger(mode);
			return true;
		}
	}
	// Unable to find what mode enum the input maps to.
	return false;
}


whiteboard.saveCanvas = function() {
	// First convert the canvas to a blob.
	var canvasBlob = whiteboard.canvas.toDataURL("image/png");

	// Send to server as ajax
	var xhr = new XMLHttpRequest();
	var url = "api/save.php";
	var params = "canvasID=" + whiteboard.canvasID + "&imgBase64=" + canvasBlob;
	xhr.open('POST', url, true);

	// Send headers
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	// Deal with server response
	xhr.onreadystatechange = function() {
		// readyState 4 means the request is done.
		var DONE = 4;
		// HTTP status 200 is a successful return
		var OK = 200;
		if (xhr.readyState === DONE) {
			if (xhr.status === OK) {
				console.log("SAVE SUCCESSFUL.");
			}
			else {
				console.log("SAVE FAILED.");
			}
		}
	};

	xhr.send(params);
}