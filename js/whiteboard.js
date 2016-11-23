'use strict'

var whiteboard = whiteboard || {};

whiteboard.canvas = document.getElementById("whiteboard");

/**
 * whiteboard.lastDrawnPoint
 *
 * We store the last drawn point, that way we can interpolate between the individual dots.
 * Originally is initialized off screen
 */
whiteboard.lastDrawnPoint = new Point(-999, -999);

/**
 * whiteboard.drawStroke
 * 
 * @param  {Point[]} points Array of all the ints to represent the path to draw.
 */
whiteboard.drawStroke = function(points) {

	// Fail fast if there are no points to draw.
	if (points.length < 1) {
		return;
	}

	// Fetch the context from the canvas
	var ctx = whiteboard.canvas.getContext("2d");

	// If we are currently drawing, then move the context to the last drawn point.
	if (whiteboard.isDrawing) {
		ctx.moveTo(whiteboard.lastDrawnPoint.x, whiteboard.lastDrawnPoint.y);
	}
	// Move the context to the first point in the path.
	else if (points.length > 0 && points[0] instanceof Point) {
		ctx.moveTo(points[0].x, points[0].y);
	}

	// Iterate through the given path and draw through it.
	for (var i = 0; i < points.length; i++) {
		var p = points[i];
		// Verify that point is actually a point.
		if (p.x === undefined || p.x === null
			|| p.y === undefined || p.y === null) 
		{
			return -1;
		}

		// Create a line and draw
		ctx.lineTo(p.x + 0.5, p.y);
		ctx.stroke();
	}

	// Set the last drawn point
	if (points.length > 0) {
		whiteboard.lastDrawnPoint = points[points.length - 1];
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
			whiteboard.drawStroke([new Point(event.pageX, event.pageY)]);
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
