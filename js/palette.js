/**
 * palette.js
 *
 * A palette class that defines the look and UI functionality of the options 
 */

'use strict'

var palette = palette || {};

/**
 * HTML elements
 */
palette.containerDiv = document.getElementById("palette-container");
palette.arrowDiv = document.getElementById("palette-expand-btn");
palette.paletteDiv = document.getElementById("palette");
palette.colorSwatchContainer = document.getElementById("color-swatch-container");
palette.brushSizeInput = document.getElementById("brush-size");

/**
 * An array of CSS3 standardized colors; can be strings containing valid hex, rgb(), rgba() values.
 * @type {Array}
 */
palette.defaultColors = ["#000", "#F00", "#0F0", "#00F", "#FFF"];

palette.init = function() {
	palette.initToggle();
	palette.initColorSwatches();
	palette.initBrushSizeInput();
};

/** 
 * palette.initToggle
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

/**
 * palette.initColorSwatches
 * 
 * Takes the colors from the palette object's defaultColors array and converts them
 * into clickable HTML elements that exist within the palette HTML element.
 */
palette.initColorSwatches = function() {
	// Iterate through the default colors of the palette and append them to the div.
	for (var i = 0; i < this.defaultColors.length; i++) {
		// Create new HTML element to handle the color swatch
		var newElement = document.createElement("div");
		newElement.classList.add("color-swatch");
		newElement.setAttribute("style", "background: " + this.defaultColors[i]);

		// Now make the color swatch triggerable
		newElement.addEventListener('click', function() {
			// Fetch the background-color CSS of the swatch and use it to change the brush object.
			brush.setColor(this.style.backgroundColor);
		});

		// Add the newly crafted element to the palette div.
		palette.colorSwatchContainer.appendChild(newElement);
	}
};

/**
 * palette.initBrushSizeInput
 * 
 * Adds the change function necessary to track when the user adjusts the brush size input.
 */
palette.initBrushSizeInput = function() {
	// Modify input value based on the current brush size.
	palette.brushSizeInput.value = brush.size;

	// Add event listener on input change
	palette.brushSizeInput.addEventListener("input", function() {
		brush.setSize(this.value);
	})
}
