NEEDLE.plug("Movements", function() {
// Extends NEEDLE.Move class
NEEDLE.transplant("Movements", NEEDLE.Move);
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
	this.gradual = [];
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
	this.gradual[element.configuration.id] = new NEEDLE.Gradual("progression", {
		length: Math.ceil(element.configuration.length/element.configuration.id), 
		start: 15, 
		step: 1, 
		section: 16, 
		factor: 5, 
		reverse: true
	});
	_effects.call(this, element, callback);
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

	element.element.cycling = setTimeout(function() {
		that.cycling(element, callback);
		
		if (element.lengthX <= 0 && element.lengthY <= 0) {
			return false;
		}
		_effects.call(that, element, callback);
	}, this.gradual[element.configuration.id].next());
}

return Movements;
});