/**
 * callback.js
 *
 * The callback class is tasked with registering and calling functions associated with events.
 */

'use strict'

var callback = callback || {};

/**
 * callback._hooks
 *
 * An object designed to store lists of function variables associated with given events.
 * 
 * @type {Object}
 */
callback._hooks = {};

/**
 * callback.register
 *
 * This function is designed to store a given function in callback._hooks, and associate it with a given event name.
 * When that particular event is triggered, the function (and any others previously registered to this event) will
 * be called.
 * 
 * @param  {String} event 	Given name of event to register function with.
 * @param  {Function} func  Given function.
 * @return {Boolean}		True if successfully registered; false otherwise.
 */
callback.register = function(event, func) {
	// Verify input types.
	if (!helper.verifyString(event) || !helper.verifyFunction(func)) {
		return false;
	}
	// If event has nothing registered with it yet, then key-value pair with its value as an empty list.
	if (!helper.isSet(callback._hooks[event])) {
		callback._hooks[event] = [];
	}

	// push returns new length, so if its old length and new length are unequal,
	// then registration was successful.
	return callback._hooks[event].length !== callback._hooks[event].push(func);
}

/**
 * callback.call
 *
 * This function is designed to call all functions associated with the given event name.
 * @param  {String} event 	Name of event that is to be triggered.
 */
callback.call = function(event) {
	// Ensure given event is a string
	if (!helper.verifyString(event)) {
		return;
	}

	if (callback._hooks[event] !== undefined && callback._hooks[event] !== null) {
		// Iterate through the hooked functions associated with this event.
		for (var i = 0; i < callback._hooks[event].length; i++) {
			// Call the given callback.
			callback._hooks[event][i]();
		}
	}

}