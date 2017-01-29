/**
 * whiteboard.js
 *
 * The whiteboard class contains all means needed for storage of the canvas object
 * and all modifications made to it.
 */

'use strict'

var whiteboard = whiteboard || {};

/**
 * whiteboard.canvasLoaded
 *
 * True if the canvas has been loaded, false otherwise.
 *
 * @type {Boolean}
 */
whiteboard.canvasLoaded = false;

/**
 * whiteboard.canvasID
 * 
 * The canvas is identified using a hash code.
 *
 * @type {String}
 */
whiteboard.canvasID = "";

/**
 * whiteboard.modes
 *
 * An enum that represents the different action modes possible with the whiteboard.
 * "DRAW" is to using a brush tool, as "ERASE" is to using an eraser.
 * 
 * @type {Enum}
 */
whiteboard.modes = Enum("DRAW", "ERASE");

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
 * whiteboard.init
 *
 * This function handles any configuration required for the whiteboard object prior to use.
 * 
 */
whiteboard.init = function() {
	// Attach the trackMouse function to the document
	document.onmousemove = whiteboard.trackMouse;
	// Attach the whiteboard resize event to onload and onresize
	window.onload = whiteboard.resize;
	window.resize = whiteboard.resize;

	// Set the default mode of the whiteboard to draw.
	whiteboard.currentMode = whiteboard.modes.DRAW;

	if (window.location.hash) {
		// Set canvas ID using the hash in the url.
		whiteboard.canvasID = window.location.hash.replace("#", "");

		// Attempt to load the canvas with the associated hash.
		whiteboard.loadCanvas();

		// Wait for finished response from canvas load, and create new canvas if not successful.
		callback.register("onCanvasLoad", function() {
			// If ID or canvas not available, create a new canvas on the backend, fetching a new id.
			if (!whiteboard.canvasLoaded) {
				whiteboard.createCanvas();
			}
		});
	}
	else {
		// User has no specific canvas in mind, so create a fresh one.
		whiteboard.createCanvas();
	}
}

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
 * whiteboard.setCurrentMode
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

/**
 * whiteboard.setCanvasID
 * 
 * @param {String} id 	The new canvas ID for the whiteboard.
 * @return {Boolean}	True if successful, false otherwise.
 */
whiteboard.setCanvasID = function(id) {
	if ((typeof(id) === "string" || id instanceof String) && id.length > 0) {
		// Set the window's hash and the whiteboard's canvasID.
		window.location.hash = id;
		whiteboard.canvasID = id;
		return true;
	}
	// Input is not valid string.
	return false;
}

/**
 * whiteboard.createCanvas
 * 
 * This function uses ajax to communicate with the backend and generate a random, unused canvas ID
 * to start using for this new whiteboard.
 *
 */
whiteboard.createCanvas = function() {

	// Send to server as ajax
	var xhr = new XMLHttpRequest();
	var url = "api/create.php";
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
			// The request is finished and we got a response of some kind
			// Parse from JSON string into object.
			var response = JSON.parse(xhr.response);
			if (xhr.status === OK) {
				if (response.success) {
					// console.log("CREATE SUCCESSFUL.");
					whiteboard.canvasLoaded = whiteboard.setCanvasID(response.canvasID);
				}
				else {
					console.log("CREATE FAILED: " + response.message);
				}
			}
			else {
				console.log("CREATE FAILED.");
			}
		}
	};

	// No parameters to be sent at this time.
	xhr.send(null);
}

/**
 * whiteboard.saveCanvas
 *
 * This function converts the content of the canvas into a PNG image formatted in base64 encoding,
 * which is then sent to the backend for storage in the database.
 *
 */
whiteboard.saveCanvas = function() {
	// First convert the canvas to a blob.
	var canvasBlob = whiteboard.canvas.toDataURL("image/png");

	// Send to server as ajax
	var xhr = new XMLHttpRequest();
	var url = "api/save.php";
	var params = "canvasID=" + whiteboard.canvasID + "&imgBase64=" + encodeURIComponent(canvasBlob);
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
			var response = JSON.parse(xhr.response);
			if (xhr.status === OK) {
				if (response.success) {
					// console.log("SAVE SUCCESSFUL.");				
				}
				else {
					console.log("SAVE FAILED: " + response.message);
				}
			}
			else {
				console.log("SAVE FAILED.");
			}
		}
	};

	xhr.send(params);
}

/**
 * whiteboard.loadCanvas
 *
 * This function loads communicates with backend asynchroniously and requests that the backend load
 * and return the base64 encoded image. Then, the front loads the source into a dummy image, and uses
 * that dummy image to draw to the canvas.
 *
 */
whiteboard.loadCanvas = function() {

	// Send to server as ajax
	var xhr = new XMLHttpRequest();
	var url = "api/load.php?canvasID=" + whiteboard.canvasID;
	xhr.open('GET', url, true);

	// Send headers
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	// Deal with server response
	xhr.onreadystatechange = function() {
		// readyState 4 means the request is done.
		var DONE = 4;
		// HTTP status 200 is a successful return
		var OK = 200;
		if (xhr.readyState === DONE) {
			// The request is finished and we got a response of some kind
			// Parse from JSON string into object.
			var response = JSON.parse(xhr.response);
			if (xhr.status === OK) {
				if (response.success) {
					if (response.canvasBlob !== null && response.canvasBlob !== undefined && response.canvasBlob.length > 0) {
						// Take the canvas blob and create a new image with it.
						var image = new Image();
						// Upon loading the image, draw it.
						image.onload = function() {
							whiteboard.canvas.getContext("2d").drawImage(image, 0, 0);
						}
						// The image's source will be the canvas blob we received from the response.
						image.src = response.canvasBlob;
					}
					// console.log("LOAD SUCCESSFUL.");
					whiteboard.canvasLoaded = true;
				}
				else {
					console.log("LOAD FAILED. " + response.message);
				}
			}
			else {
				console.log("LOAD FAILED.");
			}

			// Response has finished. Trigger any callbacks associated with onCanvasLoad.
			callback.call("onCanvasLoad");
		}
	};

	xhr.send(null);
}