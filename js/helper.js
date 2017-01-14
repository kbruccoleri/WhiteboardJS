/**
 * helper.js
 *
 * The helper class contains various helper functions.
 */

'use strict'

var helper = helper || {};

/************ Converters ************/

/**
 * Function designed to take in a color string and ensure that it is converted to hexadecimal format.
 * @param  {String} color Color string
 * @return {String}       In hexadecimal format.
 */
helper.colorToHex = function(color) {
	// Check if color is already in hexadecimal format.
	if (helper.verifyHex(color)) {
		return color;
	}
	// For now, RGBA format will be ignored and treated as RGB.
	// Check if color is already in RGB format.
	else if (helper.verifyRGB(color)) {
		color = color.replace("rgb(", "").replace(")", "");
		var colorList = color.split(",");
		var redComp = helper.integerToHex(colorList[0], 2);
		var greenComp = helper.integerToHex(colorList[1], 2);
		var blueComp = helper.integerToHex(colorList[2], 2);

		return '#' + redComp + greenComp + blueComp;
	}
	else if (helper.verifyRGBA(color)) {
		color = color.replace("rgba(", "").replace(")", "");
		var colorList = color.split(",");
		var redComp = helper.integerToHex(colorList[0], 2);
		var greenComp = helper.integerToHex(colorList[1], 2);
		var blueComp = helper.integerToHex(colorList[2], 2);

		return '#' + redComp + greenComp + blueComp;
	}
	else {
		return null;
	}
}

/**
 * Function to convert an integer to a hexadecimal.
 * 
 * @param  {Integer} int       	An integer value for conversion.
 * @param  {Integer} minLength  The shortest length acceptable for the result. 
 * @return {String}          	Hexadecimal string.
 */
helper.integerToHex = function(int, minLength) {
	// Ensure int is actually an integer.
	int = helper.toInteger(int);
	if (int === null) {
		return null;
	}

	// Default minLength to 2 if not already set, as this function is mostly expected for use between 0 - 255.
	minLength = minLength || 2;

	// Prepare to loop through int, breaking off factors of 16 each time.
	var hex = "";
	while (int > 0) {
		// Prepend new digit.
		hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"][int % 16] + hex;
		int = Math.floor(int/16);
	}
	// Prefill the hex if its length is shorter than desired.
	while (hex.length < minLength) {
		hex = "0" + hex;
	}
	
	return hex;
}

/**
 * Function designed with taking in a parameter or either String or Number, and converting it into a Number.
 * 
 * @param  {String/Number} input The input that is to be converted into a Number.
 * @return {Number/null}       Converted into Number; null if failure.
 */
helper.toNumber = function(input) {
	if (typeof input == "string" || input instanceof String) {
		return Number(input.trim());		
	}
	return null;
};

/**
 * toInteger converts its parameter into an Integer.
 * 
 * @param  {String/Number} input The input that is to be converted into a Integer.
 * @return {Integer/null}       Result converted into Integer; null if failure.
 */
helper.toInteger = function(input) {
	if (typeof input == "string" || input instanceof String) {
		return parseInt(input.trim());		
	}
	else if (typeof input == "number" || input instanceof Number) {
		return parseInt(input);
	}
	return null;
};

/************ Color Verification ************/

/**
 * Verifies whether or not given string is a valid hexidecimal value. Accepts both hex values of either 3 or 6.
 * @param  {String} hex Given hex value.
 * @return {Boolean}    True if valid, false otherwise.
 */
helper.verifyHex = function(hex) {
	if ( (typeof hex == "string" || hex instanceof String)
		&& hex[0] === "#" 
		&& (hex.substr(1).length === 3 || hex.substr(1).length === 6)) {

		return true;
	}
	else {
		return false;
	}
};


/**
 * Verifies whether or not given string is a valid rgb value.
 * @param  {String} rgb Given rgb value.
 * @return {Boolean}    True if valid, false otherwise.
 */
helper.verifyRGB = function(rgb) {
	// Outer level verifies the proper syntax surrounding actual color value.
	if ( (typeof rgb == "string" || rgb instanceof String)
		&& rgb.slice(0, 4) === "rgb(" 
		&& rgb.slice(-1) === ")") {

		// Verify actual color value.
		rgb = rgb.replace("rgb(", "").replace(")", "");
		var colorList = rgb.split(",");

		// Fail fast if the length is not correct.
		if (colorList.length !== 3) {
			return false;
		}

		var currentColor;
		for (var i = 0; i < colorList.length; i++) {
			currentColor = helper.toInteger(colorList[i]);
			if (currentColor < 0 || currentColor > 255) {
				return false;
			}
		}

		return true;
	}
	else {
		return false;
	}
};

/**
 * Verifies whether or not given string is a valid rgba value.
 * @param  {String} rgba Given rgba value.
 * @return {Boolean}    True if valid, false otherwise.
 */
helper.verifyRGBA = function(rgba) {
	// Outer level verifies the proper syntax surrounding actual color value.
	if ( (typeof rgba == "string" || rgba instanceof String)
		&& rgba.slice(0, 5) === "rgba(" 
		&& rgba.slice(-1) === ")") {

		// Verify actual color value.
		rgba = rgba.replace("rgba(", "").replace(")", "");
		var rgbaList = rgba.split(",");

		// Fail fast if the length is not correct
		if (rgbaList.length !== 4) {
			return false;
		}

		// Remove the opacity from the end of the array and store it separately.
		var opacity = helper.toNumber(rgbaList.splice(3));

		// Fail fast if opacity is not between 0 and 1, inclusive.
		if (opacity < 0 || opacity > 1) {
			return false;
		}

		var currentColor;
		for (var i = 0; i < rgbaList.length; i++) {
			currentColor = helper.toInteger(rgbaList[i]);
			if (currentColor < 0 || currentColor > 255) {
				return false;
			}
		}

		return true;
	}
	else {
		return false;
	}
};