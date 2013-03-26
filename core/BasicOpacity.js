NEEDLE.transplant("BasicOpacity", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(BasicOpacity, NEEDLE.Object);
/**
 * @class BasicOpacity 
 * @note in IE7 a child element with position relative is not affected of the transparency
 */
function BasicOpacity(configuration) {
	this.BasicOpacity(configuration);
}

/**
 * @constructor BasicOpacity
 * @access public
 * 
 * @param configuration Object (optional)
 * configuration.visible Boolean - visible or not at initialization
 * configuration.step Float - incremental step
 * configuration.maxOpacity Float - max opacity to reach
 * configuration.minOpacity Float - min opacity to reach
 * @returns void
 */
BasicOpacity.prototype.BasicOpacity = function(configuration) {
	if (typeof configuration === "object") {
		this.visible = configuration.visible || false;
		this.step = configuration.step || 0.1;
		this.maxOpacity = configuration.maxOpacity || 1;
		this.minOpacity = configuration.minOpacity || 0;
		this.interval = configuration.interval || 20;
	}
	_equlize.call(this);
};
/**
 * @method set
 * @access public
 * 
 * @description Makes target element initial preparation and 
 * returns configuration object 
 * TODO make it work as it is in the Move class (passing config object here as well)
 * 
 * @param target String|HTMLElement (required)
 * @param button String|HTMLElement (optional)
 * @param configuration Object (optional) - configuration object as the one from the constructor
 * 
 * @returns Object
 */
BasicOpacity.prototype.set = function(target, button, configuration) {
	target = NEEDLE.get(target);
	return (target) ? new Details(NEEDLE.objectMerge({ target : target, button : NEEDLE.get(button) }, this.getPublicProperties(), configuration)) : {};
};
/**
 * @method start
 * @access public
 * 
 * @description Makes HTML element to appear or disappear. 
 * @note Currently it is possible to have inProgress version and one without checking inProgress.
 * 
 * @param element Object (required) - returned from "set" method
 * @param event String appear|disappear (optional) 
 * @param callback Function (optional)
 * @returns void
 */
BasicOpacity.prototype.start = function(element, event, callback) {
	clearInterval(element.cycling);
	var step = this.step, style = element.target.style;
	
	if (event == "appear") {
		var sign = 1, minMax = this.maxOpacity;
	} else {
		var sign = -1, minMax = this.minOpacity*sign;
	}
	
	element.inProgress = true;
	element.cycling = setInterval(function() {
		if (element.opacity*sign < minMax) {
			element.opacity += sign*step;
		} else {
			//element.opacity = minMax*sign;
			element.inProgress = false;
			clearInterval(element.cycling);

			(typeof callback == "function") && callback(element);
		}
		_assignOpacity(style, element.opacity);
	}, this.interval);
};
/**
 * @method reset
 * @access public
 * 
 * @description Resets element to its initial state (visible or not). 
 * 
 * @param element Object (required) - returned from "set" method
 * @returns void
 */
BasicOpacity.prototype.reset = function(element) {
	element.opacity = (this.visible) ? this.maxOpacity : this.minOpacity;
	_assignOpacity(element.target.style, element.opacity);
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
 * config.visible Boolean (required)
 * config.opacity Object (required)
 * 
 * @returns void
 */
function Details(config) {
	this.target = config.target;
	this.button = config.button;
	this.opacity = (!config.visible) ? config.minOpacity : config.maxOpacity;
	this.inProgress = false;
	
	if (!document.all || typeof Array.prototype.indexOf !== "undefined") {		
		this.target.style.opacity = this.opacity;
	} else {
		var elements = this.target.getElementsByTagName("*"), i = elements.length;
		this.target.style.filter = "alpha(opacity=" + this.opacity + ")";
		this.target.style.zoom = 1;

		while (i--) { elements[i].style.filter = "inherit"; }
	}
};
/**
 * @method _equlize
 * @access private
 * 
 * @description Equilizes values for IE. 
 * 
 * @returns void
 */
function _equlize() {
	if (document.all && typeof Array.prototype.indexOf === "undefined") {
		this.step *= 100;
		this.maxOpacity *= 100;
		this.minOpacity *= 100;
	}
};
/**
 * @method _assignOpacity
 * @access private
 * 
 * @description Sets HTML element's opacity value. 
 * 
 * @param style HTMLELement Style object (required)
 * @param opacity Integer (required)
 * @returns void
 */
function _assignOpacity(style, opacity) {
	_assignOpacity = function(style, opacity) { (!document.all || typeof Array.prototype.indexOf !== "undefined") ? (style.opacity = opacity) : (style.filter = "alpha(opacity=" + opacity + ")"); };
	_assignOpacity(style, opacity);
};

return BasicOpacity;
});