/**
 * whiteboard.js
 *
 * The whiteboard class contains all means needed for storage of the canvas object
 * and all modifications made to it.
 */

'use strict'

var whiteboard = whiteboard || {};

whiteboard.modes = Enum("DRAW", "ERASE");

whiteboard.currentMode = whiteboard.modes.DRAW;

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
 * whiteboard.isInStroke
 *
 * We store whether or not the user is currently dragging the cursor across the whiteboard. If so,
 * this allows us to identify whether or not to fill in the gaps between various points detected.
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
