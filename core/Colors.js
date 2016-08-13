NEEDLE.transplant("Colors", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(Colors, NEEDLE.Object);

/**
 * @class Colors
 * TODO Make it work for several elements with one instance (similar to Move and BasicOpacity classes).
 *
 */
function Colors(element, configuration) {
	this.Colors(element, configuration);
}

/**
 * @constructor Colors
 * @access public
 *
 * @param element HTMLElement|String Id (required)
 * @param configuration Object (required)
 * configuration.interval Array - array of integers for each setInterval call
 * configuration.colors Array - array of strings with "from" and "to" colors
 * configuration.to String - apply to backgroundColor or color
 * configuration.step Integer - step length for each color iteration
 *
 * @returns void
 */
Colors.prototype.Colors = function(element, configuration) {
	var i = 3, style = NEEDLE.get(element).style;

	this.interval = [];
	if (typeof configuration == "object") {
		this.colors = [Colors.RGBtoArray(configuration.colors[0]), Colors.RGBtoArray(configuration.colors[1])];
		this.to = configuration.to || "color";
		this.steps = configuration.steps || Colors.steps;
	}
	while (i--) { _traverse.call(this, style, i); }
};

/**
 * @method stop
 * @access public
 *
 * @description Stops traversing colors.
 *
 * @param callback Function (optional)
 *
 * @returns void
 */
Colors.prototype.stop = function(callback) {
	var i = this.interval.length;
	while (i--) { clearInterval(this.interval[i]); }
	(typeof callback === "function") && callback();
};


/**
 * @method _traverse
 * @access private
 *
 * @description Traversing colors.
 * TODO Make the speed equal no matter of the "from" and "to" color (right now it will be faster if these two colors are close)
 *
 * @param style HTMLElement Style object (required)
 * @param i Integer (required) - current iteration
 *
 * @returns void
 */
function _traverse(style, i) {
	var that = this,
		diff = this.colors[0][i] - this.colors[1][i],
		sign = (diff > 0) ? -1 : 1, step;

	diff = Math.abs(diff);
	step = parseInt(diff/this.steps);
	this.interval[i] = setInterval(function() {
		((diff - step) < 0) && (step = diff);

		that.colors[0][i] += sign*step;
		style[that.to] = "rgb(" + that.colors[0].join(",") + ")";
		diff -= step;

		(diff <= 0) && clearInterval(that.interval[i]);
	}, 15);
}

/**
 * @property step
 * @access public static
 *
 * @description Step speed.
 */
Colors.steps = 10;

/**
 * @property RGBPattern
 * @access public static
 *
 * @description Contains pattern for RGB color matching.
 */
Colors.RGBPattern = /\d{1,3},\s*\d{1,3},\s*\d{1,3}/;

/**
 * @property HEXPattern
 * @access public static
 *
 * @description Contains pattern for HEX color matching.
 */
Colors.HEXPattern = /^\#*([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

/**
 * @method RGB
 * @access public static
 *
 * @description Turns color into RGB string.
 *
 * @param color String (required)
 *
 * @returns String|false - RGB representation
 */
Colors.RGB = function(color) {
	if (Colors.isHEX(color)) {
		color = color.replace("#", "");
		if (color.length == 3) {
			color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
		}
		color = /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/i.exec(color).slice(1);
		return parseInt(color[0], 16) + "," + parseInt(color[1], 16) + "," + parseInt(color[2], 16);

	} else if (Colors.isRGB(color)) {
		return Colors.RGBPattern.exec(color)[0].replace(/\s/g, "");
	}
	return false;
};

/**
 * @method HEX
 * @access public static
 *
 * @description Turns color into HEX string.
 *
 * @param color String (required)
 *
 * @returns String|false - HEX representation
 */
Colors.HEX = function(color) {
	var rgb = Colors.RGBtoArray(color);
	if (typeof rgb == "object") {
		var i = rgb.length;
		while (i--) {
			rgb[i] = rgb[i].toString(16);
			(rgb[i].length == 1) && (rgb[i] = "0" + rgb[i]);
		}
		return rgb[0] + rgb[1] + rgb[2];

	} else if (Colors.isHEX(color)) {
		return color.replace("#", "");
	}
	return false;
};

/**
 * @method RGBtoArray
 * @access public static
 *
 * @description Turns RGB color into Array.
 *
 * @param color String (required)
 *
 * @returns Array|false
 */
Colors.RGBtoArray = function(color) {
	if (Colors.isRGB(color)) {
		color = Colors.RGBPattern.exec(color)[0].replace(/\s/g, "");
		color = color.split(",");
		color[0] = parseInt(color[0]);
		color[1] = parseInt(color[1]);
		color[2] = parseInt(color[2]);
		return color;
	} else if (Colors.isHEX(color)) {
		return Colors.RGBtoArray(Colors.RGB(color));
	}
	return false;
};

/**
 * @method isRGB
 * @access public static
 *
 * @description Checks if color is RGB.
 *
 * @param color String (required)
 *
 * @returns Boolean
 */
Colors.isRGB = function(color) {
	return Colors.RGBPattern.test(color);
};

/**
 * @method isHEX
 * @access public static
 *
 * @description Checks if color is HEX.
 *
 * @param color String (required)
 *
 * @returns Boolean
 */
Colors.isHEX = function(color) {
	return Colors.HEXPattern.test(color);
};

return Colors;
});
