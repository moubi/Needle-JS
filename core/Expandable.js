NEEDLE.transplant("Expandable", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(Expandable, NEEDLE.Object);

/**
 * @class Expandable
 *
 */
function Expandable(configuration) {
	this.Expandable(configuration);
}

/**
 * @constructor Expandable
 * @access public
 *
 * @param configuration Object (optional)
 * configuration.expanded Boolean - expanded or not on init
 * configuration.expandStep Integer - incremental open step
 * configuration.collapseStep Integer - incremental close step
 * configuration.expandInterval Integer - interval cycle speed on expand
 * configuration.collapseInterval Integer - interval cycle speed on collapse
 * configuration.min Integer - min height of an element
 *
 * @returns void
 */
Expandable.prototype.Expandable = function(configuration) {
	if (typeof configuration === "object") {
		this.expanded = (typeof configuration.expanded != "undefined") ? configuration.expanded : true;
		this.expandStep = configuration.expandStep || 30;
		this.collapseStep = configuration.collapseStep || 30;
		this.expandInterval  = configuration.expandInterval || 15;
		this.collapseInterval = configuration.collapseInterval || 15;
		this.min = configuration.min || 0;
	}
};

/**
 * @method set
 * @access public
 *
 * @description Makes target element initial preparation and returns configuration object
 *
 * @param target String|HTMLElement (required)
 * @param button String|HTMLElement (optional)
 * @param configuration Object (optional) - configuration object as the one from the constructor
 *
 * @returns Object
 */
Expandable.prototype.set = function(target, button, configuration) {
	target = NEEDLE.get(target);
	return (target) ? new Details(NEEDLE.objectMerge({ target : target, button : NEEDLE.get(button) }, this.getPublicProperties(), configuration)) : {};
};

/**
 * @method collapse
 * @access public
 *
 * @description Collapses an element
 *
 * @param element Object (required) - returned from "set" method
 * @param callback Function (optional)
 *
 * @returns void
 */
Expandable.prototype.collapse = function(element, callback) {
	this.start("collapse", element, callback);
	return this;
};

/**
 * @method expand
 * @access public
 *
 * @description Expands an element
 *
 * @param element Object (required) - returned from "set" method
 * @param callback Function (optional)
 *
 * @returns void
 */
Expandable.prototype.expand = function(element, callback) {
	this.start("expand", element, callback);
	return this;
};

/**
 * @method start
 * @access public
 *
 * @description Expands or collapses an element
 *
 * @param element Object (required) - returned from "set" method
 * @param event String expand|collapse (optional)
 * @param callback Function (optional)
 *
 * @returns void
 */
Expandable.prototype.start = function(event, element, callback) {
	var that = this, elementStyle = element.target.style,
		getExpandCollapseHeight = event + "Height";

	element.inProgress = true;
	clearInterval(element.cycling);

	if (event == "expand") {
		var limit = parseInt(element.target.scrollHeight), sign = 1;
	} else {
		var limit = this.min, sign = -1;
	}

	element.cycling = setInterval(function() {
		if (element.height*sign < limit) {
			element.height = that[getExpandCollapseHeight](element);
		} else {
	    element.inProgress = false;
	    element.expanded = !element.expanded;
			clearInterval(element.cycling);
	    (typeof callback === "function") && callback();
		}
		elementStyle.height = element.height + "px";
	}, this[event + "Interval"]);
};

/**
 * @method expandHeight
 * @access public
 *
 * @description Gets next expand step value
 *
 * @param element Object (required) - returned from "set" method
 *
 * @returns Integer
 */
Expandable.prototype.expandHeight = function(element) {
	var addition = element.height + this.expandStep;
	return (addition < element.target.scrollHeight) ? addition : element.target.scrollHeight;
};

/**
 * @method collapseHeight
 * @access public
 *
 * @description Gets next collapse step value
 *
 * @param element Object (required) - returned from "set" method
 *
 * @returns Integer
 */
Expandable.prototype.collapseHeight = function(element) {
	var difference = element.height - this.collapseStep;
	return (difference > this.min) ? difference : this.min;
};

/**
 * @class Details
 * @access private
 *
 * @description Prepares element state.
 *
 * @param config Object (required)
 * config.button HTMLElement|null (required)
 * config.target HTMLElement (required)
 * config.expanded Boolean (required)
 *
 * @returns void
 */
function Details(config) {
	var style = config.target.style;
	this.target = config.target;
	this.button = config.button;
	this.expanded = config.expanded;
	this.inProgress = false;

	style.overflow = "hidden";
	style.height = (this.expanded) ? this.target.scrollHeight + "px" : 0;
	this.height = parseInt(style.height);
}

return Expandable;
});
