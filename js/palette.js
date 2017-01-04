/**
 * palette.js
 *
 * A palette class that defines the look and UI functionality of the options 
 */

'use strict'

var palette = palette || {};

palette.containerDiv = document.getElementById("palette-container");
palette.arrowDiv = document.getElementById("palette-expand-btn");
palette.paletteDiv = document.getElementById("palette");

palette.defaultColors = ["#000", "#F00", "#0F0", "#00F", "#FFF"];
palette.isExpanded = false;

palette.init = function() {
	palette.initToggle();
	palette.initColorSwatches();
};

/** 
 * palete.initToggle
 *
 * The function is meant initialize the toggles the CSS classes associated with the 
 */
palette.initToggle = function() {
	palette.arrowDiv.addEventListener('click', function() {
		// Check if the palette is expanded already or not
		if (palette.containerDiv.classList.contains('expanded')) {
			// Remove the expanded class from both the div and arrowDiv
			palette.containerDiv.classList.remove('expanded');
		} 
		else {
			palette.containerDiv.classList.add('expanded');
		}
	});
};

palette.initColorSwatches = function() {
	// Iterate through the default colors of the palette and append them to the div.
	for (var i = 0; i < this.defaultColors.length; i++) {
		// Create new HTML element to handle the color swatch
		var newElement = document.createElement("div");
		newElement.classList.add("color-swatch");
		newElement.setAttribute("style", "background: " + this.defaultColors[i]);
		palette.paletteDiv.appendChild(newElement);
	}
};
