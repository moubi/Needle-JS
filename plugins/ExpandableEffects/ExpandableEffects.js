NEEDLE.plug("ExpandableEffects", function() {
// Extends NEEDLE.Expandable class
NEEDLE.extend(ExpandableEffects, NEEDLE.Expandable);

ExpandableEffects.progression = ["round", "fibonacci"];

/**
 * @class ExpandableEffects
 *
 */
function ExpandableEffects(configuration) {
	this.ExpandableEffects(configuration);
}

/**
 * @constructor ExpandableEffects
 * @access public
 *
 * @param configuration Object (required)
 *
 * @returns void
 */
ExpandableEffects.prototype.ExpandableEffects = function(configuration) {
	this.Expandable(configuration);
	this.progression = {};
};

/**
 * @method effects
 * @access public
 *
 * @description Sets progression type
 *
 * @param event expand|collapse String (required)
 * @param progression Object (required)
 *
 * @returns ExpandableEffects instance pointer
 */
ExpandableEffects.prototype.effects = function(event, progression) {
	if (event == "expand" || event == "collapse") {
		if (progression.type) {
			if (NEEDLE.inArray(progression.type, ExpandableEffects.progression)) {
				this.progression[event] = {
					type: progression.type,
					step: this[event + "Step"],
					mirror: (typeof progression.mirror != "undefined") ? progression.mirror : false,
					reverse: (typeof progression.reverse != "undefined") ? progression.reverse : false,
					start: 1,
					factor: 1
				};
			}
		}
	}
	return this;
};

/**
 * @method elements
 * @access public
 *
 * @description Sets expandable details
 *
 * @param target DOMElement (required)
 * @param button DOMElement (optional)
 *
 * @returns Object
 */
ExpandableEffects.prototype.elements = function(target, button) {
	var details = this.set(target, button), i;
	details.progression = {};

	for (i in this.progression) {
		details.progression[i] = new NEEDLE.Gradual(this.progression[i].type, NEEDLE.objectMerge(this.progression[i], { length: details.height }));
	}
	return details;
};

/**
 * @method bounce
 * @access public
 *
 * @description Sets bounce effects
 *
 * @param config Object (required)
 * @param button Object (optional)
 *
 * @returns void
 */
ExpandableEffects.prototype.bounce = function(details, config) {
	config = config || {};
	var i = distance = config.distance || 10,
		j = config.bounces || 2,
		interval = config.interval || 30;
		step = 20*distance/100, diff = 50*distance/100,
		height = details.height,
		style = details.target.style;

	var cycle = setInterval(function() {
		if (i > 0) {
			details.height = height - (i -= step);
		} else {
			i = (distance -= diff);
			if (!--j) {
				details.height = height;
				clearInterval(cycle);
			}
		}
		style.height = details.height + "px";
	}, interval);
};

/**
 * @method expandHeight
 * @access public
 *
 * @description Increases visible height (expanding)
 *
 * @param element Object (required)
 *
 * @returns void
 */
ExpandableEffects.prototype.expandHeight = function(element) {
	if (element.progression.expand) {
		ExpandableEffects.prototype.expandHeight = function(element) {
			var addition = element.height + element.progression.expand.next();
			if (addition >= element.target.scrollHeight) {
				element.progression.expand.current = 0;
				return element.target.scrollHeight;
			}
			return addition;
		};

	} else {
		ExpandableEffects.prototype.expandHeight = function(element) {
			var addition = element.height + this.expandStep;
			return (addition < element.target.scrollHeight) ? addition : element.target.scrollHeight;
		};
	}
	return this.expandHeight(element);
};

/**
 * @method collapseHeight
 * @access public
 *
 * @description Decreases visible height (collapsing)
 *
 * @param element Object (required)
 *
 * @returns void
 */
ExpandableEffects.prototype.collapseHeight = function(element) {
	if (element.progression.collapse) {
		ExpandableEffects.prototype.collapseHeight = function(element) {
			var difference = element.height - element.progression.collapse.next();
			if (difference <= this.min) {
				element.progression.collapse.current = 0;
				return this.min;
			}
			return difference;
		};
	} else {
		ExpandableEffects.prototype.collapseHeight = function(element) {
			var difference = element.height - this.collapseStep;
			return (difference > this.min) ? difference : this.min;
		};
	}
	return this.collapseHeight(element);
};

return ExpandableEffects;
});
