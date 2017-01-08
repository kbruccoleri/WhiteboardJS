'use strict'

/**
 * This file is a preliminary test suite.
 */

/**
* Test the functionality of drawing a stroke.
*/
var testDrawStroke = function() {
	var xArr = [0, 50, 100, 200];
	var yArr = [0, 70, 100, 100];
	var points = [];

	for (var i = 0; i < xArr.length; i++)
	{
		var p = new Point(xArr[i], yArr[i]);
		points.push(p);
	}

	brush.drawStroke(points);
}

var testBrushColor = function() {
	var color = "#F00";
	brush.setColor(color);
}

var testBrushSize = function() {
	var size = 5;
	brush.setSize(size);
}

/**
 * Call all test functions once the 
 * @param  {[type]} ) {             testDrawStroke();} [description]
 * @return {[type]}   [description]
 */
document.addEventListener("DOMContentLoaded", function() {
	if (IS_DEV && false)
	{
		testBrushColor();
		testBrushSize();
		testDrawStroke();
	}
});