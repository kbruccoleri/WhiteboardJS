/**
 * whiteboard.js
 *
 * The whiteboard class contains all means needed for storage of the canvas object
 * and all modifications made to it.
 */

'use strict'

var whiteboard = whiteboard || {};

/**
 * The actual canvas HTML element straight from the DOM.
 * @type {HTML element}
 */
whiteboard.canvas = document.getElementById("whiteboard");

/**
 * whiteboard.lastDrawnPoint
 *
 * We store the last drawn point, that way we can interpolate between the individual dots.
 * Originally is initialized off screen
 */
whiteboard.lastDrawnPoint = new Point(-999, -999);

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
			brush.drawStroke([new Point(event.pageX, event.pageY)]);
			// Take note that the most recent event was a mousepress
			whiteboard.isDrawing = true;
		}
		else {
			// Take note that the most recent event was not a mousepress
			whiteboard.isDrawing = false;
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
