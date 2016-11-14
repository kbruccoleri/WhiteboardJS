'use strict'

/**
 * This file defines the Point object.
 */

function Point(x, y) {

	if (x === undefined || x === null
		|| y === undefined || y === null) {
		throw "Invalid point.";
	}

	this.x = x;
	this.y = y;
}