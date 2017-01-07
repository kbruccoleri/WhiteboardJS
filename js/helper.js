/**
 * helper.js
 *
 * The helper class contains various helper functions.
 */

'use strict'

var helper = helper || {};

/************ Converters ************/

helper.toNumber = function(input) {
	if (typeof input == "string" || input instanceof String) {
		return Number(input.trim());		
	}
	return input;
}

helper.toInteger = function(input) {
	if (typeof input == "string" || input instanceof String) {
		return parseInt(input.trim());		
	}
	return input;
}

/************ Color Verification ************/

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