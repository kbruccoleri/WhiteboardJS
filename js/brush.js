/**
 * brush.js
 *
 * The brush class is tasked with manipulating the whiteboard object by drawing on it.
 * A brush stores the size of the brush, as well as the color.
 */

'use strict'

var brush = brush || {};

/**
 * Stores the brush color as a hexadecimal value.
 * @type {String}
 */
brush.color = "#FFF";


/**
 * Stores the size of the brush (in pixels)
 * @type {Number}
 */
brush.size = 1;


/**
 * brush.drawStroke
 * 
 * @param  {Point[]} points Array of all the ints to represent the path to draw.
 */
brush.drawStroke = function(points) {

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