/**
 * helper.js
 *
 * The helper class contains various helper functions.
 */

'use strict'

var helper = helper || {};


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