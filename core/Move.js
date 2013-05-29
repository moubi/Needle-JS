NEEDLE.transplant("Move", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(Move, NEEDLE.Object);
/**
 * @class Move 
 * 
 */
function Move(configuration) {
	this.Move(configuration);
}
/**
 * @constructor Move
 * @access public
 * 
 * @param configuration Object (optional)
 * configuration.destination Object - left and right coordinates to go to
 * configuration.direction String - x|y
 * configuration.interval Integer - interval for setInterval
 * configuration.length Integer - length of path
 * configuration.step Integer - step length for each move
 * 
 * @returns void
 */
Move.prototype.Move = function(configuration) {
	if (typeof configuration === "object") {
		this.destination = configuration.destination || null;
		this.direction = configuration.direction || "x";
		this.interval = configuration.interval || 15; 
		this.length = configuration.length || 250; 
		this.step = configuration.step || 3; 
	}
};
/**
 * @method move
 * @access public
 * 
 * @description Prepares element to move (by accepting configuration object) 
 * and starts its movement.
 * @note If we have same element with same configuration it will new create details object with every move call.
 * 
 * @param element HTMLElement|String Id (required)
 * @param configuration Object (optional) - configuration object as the one from the constructor
 * @param callback Function (optional)
 * 
 * @returns void
 */
Move.prototype.move = function(element, configuration, callback) {
	this.start(new Details(NEEDLE.get(element), NEEDLE.objectMerge({ }, this.getPublicProperties(), configuration)), callback);
};
/**
 * @method start
 * @access public
 * 
 * @description Starts moving the element by cycling with setInterval function.
 * 
 * @param element Details class Instance (required)
 * @param callback Function (optional)
 * 
 * @returns void
 */
Move.prototype.start = function(element, callback) {
	var that = this;
	element.element.cycling = setInterval(function() {
		that.cycling(element, callback);
	}, element.configuration.interval);
};
/**
 * @method stop
 * @access public
 * 
 * @description Stops movement and executes callback function.
 * TODO element.cycling is not a good idea as it is problematic to put several
 * movements on a single element (all of them will have same "cycling" property)
 * 
 * @param element Details class Instance (required)
 * @param callback Function (optional)
 * 
 * @returns void
 */
Move.prototype.stop = function(element, callback) {
	clearInterval(NEEDLE.get(element).cycling);
	(typeof callback === "function") && callback.call(this);
};
/**
 * @method cycling
 * @access public
 * 
 * @description Executes on each setInterval cycle. Moves the element.
 * 
 * @param element Details class Instance (required)
 * @param callback Function (optional)
 * 
 * @returns void
 */
Move.prototype.cycling = function(element, callback) {
	(element.lengthX > 0) && _setPos(element, {length : "lengthX", step : element.stepX, pos : "left"});
	(element.lengthY > 0) && _setPos(element, {length : "lengthY", step : element.stepY, pos : "top"});

	if (element.lengthX <= 0 && element.lengthY <= 0) {
		clearInterval(element.element.cycling);
		(typeof callback === "function") && callback.call(this);
	}
};

/**
 * @class Details
 * @access private
 * 
 * @description Sets object with details regarding current movement.
 * 
 * @param element HTMLElement (required)
 * @param configuration Object (required)
 * 
 * @returns void
 */
function Details(element, configuration) {
	this.configuration = configuration = _configure(element, configuration);
	var lengthX = configuration.destination.left - parseFloat(element.style.left),  
		lengthY = configuration.destination.top - parseFloat(element.style.top);
	
	this.element = element;
	this.lengthX = Math.abs(lengthX);
	this.lengthY = Math.abs(lengthY);
	this.stepX = (this.lengthX < this.lengthY) ? configuration.step*(this.lengthX/this.lengthY) : configuration.step;
	this.stepY = (this.lengthY < this.lengthX) ? configuration.step*(this.lengthY/this.lengthX) : configuration.step;

	this.stepX = (lengthX > 0) ? Math.abs(this.stepX) : this.stepX*-1;
	this.stepY = (lengthY > 0) ? Math.abs(this.stepY) : this.stepY*-1;
	this.sign = (configuration.length > 0) ? 1 : -1;
}
/**
 * @method _configure
 * @access private
 * 
 * @description Prepares element for a movement by editing its style.
 * 
 * @param element HTMLElement (required)
 * @param configuration Object (required)
 * 
 * @returns void
 */
function _configure(element, configuration) {
	var style = element.style, 
		startLeft = (style.left) ? parseFloat(style.left) : element.offsetLeft, 
		startTop = (style.top) ? parseFloat(style.top) : element.offsetTop;

	style.position = "absolute";
	style.left = startLeft + "px";
	style.top = startTop + "px";

	if (!configuration.destination) {
		configuration.destination = {
			left : (configuration.direction == "x") ? startLeft + configuration.length : startLeft, 
			top : (configuration.direction == "y") ? startTop + configuration.length : startTop
		};
	}
	return configuration;
}
/**
 * @method _setPos
 * @access private
 * 
 * @description Set HTML element's new position (for the current cycle).
 * 
 * @param element Details class Instance (required)
 * @param params Object (required) - object containing parameters for the movement
 * 
 * @returns void
 */
function _setPos(element, params) {
	element[params.length] -= Math.abs(params.step);
	var step = (element[params.length] > 0) ? params.step : params.step + element.sign*element[params.length];
	element.element.style[params.pos] = parseInt(element.element.style[params.pos]) + step + "px";
}

return Move;
});