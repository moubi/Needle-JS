NEEDLE.transplant("Gradual", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(Gradual, NEEDLE.Object);

Gradual.FACTOR = 1.1;
Gradual.PROGRESSION_POWER = 50;
Gradual.PROGRESSION_STEP = 1;
Gradual.SLOW_FACTOR = 2;

/**
 * @class Gradual
 * TODO Create methods which get next value without the need of setting length param.
 */
function Gradual(name, params) {
	this.Gradual(name, params);
}

/**
 * @constructor Gradual
 * @access public
 *
 * @note
 * 1) Every instance is for one progression
 * 2) You need to pass integer length (not real)
 *
 * @param name String round|geometric|preogression (required) - progression type
 * @param params Object (required) - parameters for the progression
 * params.step Integer
 * params.factor Real
 * params.length Integer
 * params.section Integer
 * params.mirror Boolean - mirror the end array
 * params.reverse Boolean - reverse the end array
 *
 * @returns void
 */
Gradual.prototype.Gradual = function(name, params) {
	this.name = name;
	this.last = [];
	this.current = 0;
	this[this.name](params);
};

/**
 * @method fibonacci
 * @access public
 *
 * @description Prepares fibonacci progression
 *
 * @param params Object (required) - parameters for the progression
 * params.step Integer
 * params.factor Real
 * params.length Integer
 * params.mirror Boolean - mirror the end array
 * params.reverse Boolean - reverse the end array
 *
 * @returns void
 */
Gradual.prototype.fibonacci = function(params) {
	params.first = params.first || 1;
	params.second = params.second || 1;
	this.last = Gradual.fibonacci(params);
};

/**
 * @method geometric
 * @access public
 *
 * @description Prepares progression
 *
 * @param params Object (required) - parameters for the progression
 * params.step Integer
 * params.power Integer
 * params.length Integer
 * params.mirror Boolean - mirror the end array
 * params.reverse Boolean - reverse the end array
 *
 * @returns void
 */
Gradual.prototype.geometric = function(params) {
	params.power = (params.power || Gradual.PROGRESSION_POWER) + params.length;
	this.last = Gradual.geometric(params);
};

/**
 * @method round
 * @access public
 *
 * @description Prepares progression
 *
 * @param params Object (required) - parameters for the progression
 * params.step Integer
 * params.factor Real
 * params.length Integer
 * params.mirror Boolean - mirror the end array
 * params.reverse Boolean - reverse the end array
 *
 * @returns void
 */
Gradual.prototype.round = function(params) {
	params.step = params.step || Gradual.PROGRESSION_STEP;
	params.factor = params.factor || Gradual.SLOW_FACTOR;
	this.last = Gradual.round(params);
};

/**
 * @method progression
 * @access public
 *
 * @param params Object (required) - parameters for the progression
 *
 * @returns void
 */
Gradual.prototype.progression = function(params) {
	this.last = Gradual.progression(params);
};

/**
 * @method next
 * @access public
 *
 * @description Gets next element from the array which stores progression.
 *
 * @returns Integer
 */
Gradual.prototype.next = function() {
	return this.last[this.current++];
};

/**
 * @method prev
 * @access public
 *
 * @description Gets previous element from the array which stores progression.
 *
 * @returns Integer
 */
Gradual.prototype.prev = function() {
	return this.last[this.current--];
};

/**
 * @method geometric
 * @access public static
 *
 * @description Creates array with certain progression.
 *
 * @param params Object (required) - parameters for the progression
 *
 * @returns Array - with progression
 */
Gradual.geometric = function(params) {
	var array = [], j = 1;

	array.push(params.length*(1 - Gradual.FACTOR)/(1 - Math.pow(Gradual.FACTOR, params.power)));
	while (j < params.power) {
		array.push(array[(j++)-1] * Gradual.FACTOR);
	}
	(params.reverse) && array.reverse();
	return (params.mirror) ? Gradual.mirror(array) : array;
};

/**
 * @method round
 * @access public static
 *
 * @description Creates array with certain progression.
 *
 * @param params Object (required) - parameters for the progression
 *
 * @returns Array
 */
Gradual.round = function(params) {
	var array = [], sum = current = 1;

	array.push(current);
	while (sum <= params.length) {
		!(array.length % params.factor) && (current += params.step);
		sum += current;

		if (sum > params.length) {
			var rest = params.length - (sum - current), l = array.length;
			while (rest--) { array[--l] += 1; }
			break;
		}
		array.push(current);
	}
	(params.reverse) && array.reverse();
	return (params.mirror) ? Gradual.mirror(array) : array;
};

/**
 * @method progression
 * @access public static
 *
 * @description Creates array with certain progression.
 *
 * @param params Object (required) - parameters for the progression
 *
 * @returns Array
 */
Gradual.progression = function(params) {
	var array = [], step = params.step, i;

	array[0] = params.start || params.step;
	for (i = 1; i < params.length; i++) {
		(params.section <= i) && (step = params.factor);
		array[i] = array[i-1] + step;
	}
	(params.reverse) && array.reverse();
	return (params.mirror) ? Gradual.mirror(array) : array;
};

/**
 * @method fibonacci
 * @access public static
 *
 * @description Creates array with fibonacci progression.
 *
 * @param params Object (required) - parameters for the progression
 *
 * @returns Array
 */
Gradual.fibonacci = function(params) {
	var array = [], sum = params.first + params.second, next;

	array.push(params.first, params.second);
	while (sum <= params.length) {
		next = array[array.length-1] + array[array.length-2];
		array.push(next);
		sum = sum + next;

		// If sum is greater than requested length last element will be influenced with some value
		if (sum > params.length) {
			if ((array[array.length-1] - (sum - params.length)) >= array[array.length-2]) {
				array[array.length-1] -= (sum - params.length);
			} else {
				array[array.length-2] += (params.length - (sum - array[array.length-1]));
				array.splice(array.length-1, 1);
			}
		}
	}
	(params.reverse) && array.reverse();
	return (params.mirror) ? Gradual.mirror(array) : array;
};

/**
 * @method mirror
 * @access public static
 *
 * @description Mirrors an array containing progression.
 *
 * @param row Array (required)
 *
 * @returns Array
 */
Gradual.mirror = function(row) {
	var array = row.slice();
	return array.concat(array.slice().reverse());
};

return Gradual;
});
