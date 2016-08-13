NEEDLE.plug("ColorsTransition", function() {
/**
 * @class ColorsTransition
 *
 */
function ColorsTransition(config) {
	this.ColorsTransition(config);
}

ColorsTransition.steps = 10; 							/* Iteration number */
ColorsTransition.tag = "*"; 							/* HTML tag to apply on */
ColorsTransition.attribute = "className";				/* Element attribute to set */
ColorsTransition.attributeValue = "color_transition";	/* Element attribute value */

/**
 * @constructor ColorsTransition
 * @access public
 *
 * @param config Object (optional)
 *
 * @returns void
 */
ColorsTransition.prototype.ColorsTransition = function(config) {
	config = (typeof config === "object") ? config : {};
	this.to = config.to || "color";
	this.tag = config.tag || ColorsTransition.tag;
	this.attribute = config.attribute || ColorsTransition.attribute;
	this.attributeValue = config.attributeValue || ColorsTransition.attributeValue;
	this.steps = config.steps || ColorsTransition.steps;
	this.elements = NEEDLE.DOM.getElementsByAttribute(this.attribute, this.attributeValue, document, this.tag);
	_init.call(this);
};

/**
 * @method _init
 * @access private
 *
 * @description Initializes events to start and stop transition at.
 *
 * @returns void
 */
function _init() {
	var that = this;

	NEEDLE.Events.addEventListener(document, "mouseover", function(e) {
		var target = NEEDLE.Events.getTarget(e);
		_execute.call(that, target, "forward");
	});
	NEEDLE.Events.addEventListener(document, "mouseout", function(e) {
		var target = NEEDLE.Events.getTarget(e);
		_execute.call(that, target, "backward");
	});
}

/**
 * @method _execute
 * @access private
 *
 * @description Initializes events to start and stop transition at.
 *
 * @param target DOMElement (required)
 * @param direction - forward|backward (optional)
 *
 * @returns void
 */
function _execute(target, direction) {
	var colors = (direction == "forward") ? { from : 0, to : 1 } : { from : 1, to : 0 };
	if (NEEDLE.inArray(target, this.elements)) {
		var attributeValues = target[this.attribute].split(this.attributeValue);
		if (attributeValues.length > 1) {
			attributeValues = attributeValues[1].replace(/^\s+|\s+$/g,"").split(" ");
			if (attributeValues.length > 1 ) {
				(target.colors instanceof NEEDLE.Colors) && target.colors.stop();
				target.colors = new NEEDLE.Colors(target, { to: this.to, steps : this.steps, colors : [target.style.color || attributeValues[colors.from].replace(/^\s+|\s+$/g,""), attributeValues[colors.to].replace(/^\s+|\s+$/g,"")] });
			}
		}
	}
}

return ColorsTransition;
});
