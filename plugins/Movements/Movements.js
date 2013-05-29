NEEDLE.plug("Movements", function() {
// Extends NEEDLE.Move class
NEEDLE.extend(Movements, NEEDLE.Move);
/**
 * @class Movements 
 * 
 */
function Movements(configuration) {
	this.Movements(configuration);
};
/**
 * @constructor Movements
 * @access public 
 * 
 * @param configuration Object (required)
 * 
 * @returns void
 */
Movements.prototype.Movements = function(configuration) {
	this.Move(NEEDLE.objectMerge({ interval : 15 }, configuration));
	this.gradual = configuration.progression || null;
};
/**
 * @method start
 * @access public 
 * 
 * @description Starts movement with a defined progression. 
 * 
 * @param element HTMLElement (required)
 * @param callback Function (optional)
 * 
 * @returns void
 */
Movements.prototype.start = function(element, callback) {
	(this.gradual !== null) && _effects.call(this, element, callback);
};
/**
 * @method stop
 * @access public 
 * 
 * @description Stops movement. 
 * 
 * @param element HTMLElement (required)
 * @param callback Function (optional)
 * 
 * @returns void
 */
Movements.prototype.stop = function(element, callback) {
	clearTimeout(NEEDLE.get(element).cycling);
	element.cycling = null;
	(typeof callback === "function") && callback.call(this);
};
/**
 * @method _effects
 * @access private 
 * 
 * @description Moves element with some px based on calculation. 
 * 
 * @param element HTMLElement (required)
 * @param callback Function (optional)
 * 
 * @returns void
 */
function _effects(element, callback) {
	var that = this;
	if (element.element.cycling !== null) {
		element.element.cycling = setTimeout(function() {
			that.cycling(element, callback);
			if (element.lengthX <= 0 && element.lengthY <= 0) { return false; }
			_effects.call(that, element, callback);
		}, this.gradual.next());
	}
}

return Movements;
});