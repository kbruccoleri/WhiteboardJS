/**
 * helper.js
 *
 * The helper class contains various helper functions.
 */

'use strict'

var helper = helper || {};

/************ Converters ************/

/**
 * Function designed with taking in a parameter or either String or Number, and converting it into a Number.
 * 
 * @param  {String/Number} input The input that is to be converted into a Number.
 * @return {Number}       Converted into Number
 */
helper.toNumber = function(input) {
	if (typeof input == "string" || input instanceof String) {
		return Number(input.trim());		
	}
	return input;
}

/**
 * toInteger converts its parameter into an Integer.
 * 
 * @param  {String/Number} input The input that is to be converted into a Integer.
 * @return {Integer}       Result converted into Integer.
 */
helper.toInteger = function(input) {
	if (typeof input == "string" || input instanceof String) {
		return parseInt(input.trim());		
	}
	else if (typeof input == "number" || input instanceof Number) {
		return parseInt(input);
	}
	return input;
}

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
}


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
}

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
}