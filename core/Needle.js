(function() {

/**
 * @class Object
 * @description All other classes inherit from it
 */
function Object() { }

/**
 * @method getClassName
 * @access public
 * 
 * @description Returns name of the current class or object instance
 * 
 * @returns String 
 */
Object.prototype.getClassName = function() {
	if (this.constructor) {
		return this.getName.call(this.constructor);
	}
};
/**
 * @method getName
 * @access public
 * 
 * @description Returns name of the current function or object
 * 
 * @returns String 
 */
Object.prototype.getName = function() {
	var constructorString = this.toString();
	if (typeof this === "function") {
		return constructorString.slice("function ".length, constructorString.indexOf("("));
	} else if (typeof this === "object") {
		return constructorString.slice("[object ".length, constructorString.indexOf("]"));
	}
};
/**
 * @method getPublicProperties
 * @access public
 * 
 * @description Gets all public properties of a class
 * 
 * @returns Object 
 */
Object.prototype.getPublicProperties = function() {
	var i, obj = {};
	for (i in this) {
		(typeof this[i] != "function") && (obj[i] = this[i]);
	}
	return obj;
};
/**
 * @method getPublicMethods
 * @access public
 * 
 * @description Gets all public methods of a class
 * 
 * @returns Object 
 */
Object.prototype.getPublicMethods = function() {
	var i, obj = {};
	for (i in this) {
		(typeof this[i] == "function") && (obj[i] = this[i]);
	}
	return obj;
};
/**
 * @method getPublicMembers
 * @access public
 * 
 * @description Gets all public members of a class
 * 
 * @returns Object 
 */
Object.prototype.getPublicMembers = function() {
	var i, obj = {};
	for (i in this) {
		obj[i] = this[i];
	}
	return obj;
};
/* /OBJECT Class */

/**
 * LIBRARIAN 
 * @description Functionality for dynamically adding js classes (files) 
 * 
 * @constants 
 * PATH String - path to Needle.js file
 * SCRIPT_TAG HTMLElement - newly created script element for requesting other js or css files
 * HEAD HTMLElement - head tag pointer 
 * collection and collection2 Array - store loaded js files
 */
var PATH = document.getElementById("needle").src.split("Needle.js")[0], 
	SCRIPT_TAG = document.createElement("script"), 
	HEAD = document.getElementsByTagName("head")[0], 
	collection = [], collection2 = [], onReadyCallbacks = [];

SCRIPT_TAG.type = "text/javascript";

/**
 * @class _Details
 * @access private 
 * 
 * @description Prepares some details about each js file which will be requested.
 * 
 * @param script HTMLElement script tag (required)
 * @param loaded Boolean (required)
 * @param callback Function (optional)
 * 
 * @returns void
 */
function _Details(script, loaded, callback) {
	this.callbacks = [];
	
	this.script = _createScriptTag(script);
	this.loaded = loaded;
	(typeof callback === "function") && this.callbacks.push(callback);
}
/**
 * @method _createScriptTag
 * @access private 
 * 
 * @description Prepares some details about each js file which will be requested.
 * 
 * @param file String (required) - path to file
 * 
 * @returns HTMLElement script tag
 */
function _createScriptTag(file) {
	var script = SCRIPT_TAG.cloneNode(false);	
	script.src = (file.indexOf("/") == -1) ? PATH + file : file;

	return script;
};
/**
 * @method _appendScriptTag
 * @access private 
 * 
 * @description Appends new script tag in the head.
 * 
 * @param script HTMLElement script tag (required)
 * 
 * @returns void
 */
function _appendScriptTag(script) {
	HEAD.appendChild(script);
}
/**
 * @method _push
 * @access private 
 * 
 * @description Adds current file to the collection.
 * 
 * @param name String (required) - path to requested file
 * @param details _Details instance (required)
 * 
 * @returns void
 */
function _push(name, details) {
	collection.push(details);
	collection2[name] = details;
}
/**
 * @method _act
 * @access private 
 * 
 * @description Executes callback function, sets file as loaded and removes the garbage from document.
 * 
 * @param details _Details instance (required)
 * 
 * @returns void
 */
function _act(details) {
	details.loaded = true;
	_callbacks(details.callbacks);
	(details.script.parentNode) && details.script.parentNode.removeChild(details.script);
}
/**
 * @method _callbacks
 * @access private 
 * 
 * @description Executes callback functions.
 * 
 * @param callbacks Array (required) - callback functions
 * 
 * @returns void
 */
function _callbacks(callbacks) {
	var i = callbacks.length, j;
	if (i > 0) {
		for (j = 0; j < i; j++) { callbacks[j](); }
	}
}
/**
 * @method loadMarker
 * @access public 
 * 
 * @description Puts load marker to check when the file will load.
 * 
 * @param name String (required) - name of the Class (file) for request + ".js"
 * 
 * @returns void
 */
Needle.prototype.loadMarker = function(name) {
	_act(collection2[name]);
};
/**
 * @method require
 * @access public 
 * 
 * @description Requests new js Classes (files).
 * 
 * @param file String (required) - path to the file
 * @param callback Function (optional)
 * 
 * @returns Needle instance
 */
Needle.prototype.require = function(file, callback) {
	var name = (file.indexOf("/") != -1) ? file.substring(file.lastIndexOf("/") + 1) : file;
	if (collection2[name]) { return false; }

	var details = new _Details(file, false, callback);

	_push(name, details);
	_appendScriptTag(details.script);
	return this;
};
/**
 * @method onready
 * @access public 
 * 
 * @description Adds callback function to be executed once the last requested file is loaded.
 * @note Useful if we want to make instances and work with the requested classes.
 * 
 * @param callback Function (optional)
 * 
 * @returns Needle instance
 */
Needle.prototype.onready = function(callback) {
	var that = this, counter = collection.length;

	if (counter > 0 && typeof callback === "function") {
		while (counter--) {
			if (!collection[counter].loaded) {
				collection[counter].callbacks.push(function() { that.onready(callback); });
				return false;
			}
		}
		var i;
		for (i in collection2) {
			(typeof onReadyCallbacks[i] === "function") && onReadyCallbacks[i]();
		}
		callback();
	}
	return this;
};
/* /LIBRARIAN */

/**
 * @class Needle 
 * 
 * @description Needle library main class.
 */
function Needle() {
	this.Needle();
};
/**
 * @constructor Needle 
 * @access private
 * 
 * @returns void
 */
Needle.prototype.Needle = function() {
	this.Object = Object;
};
/**
 * @property plugins 
 * @access public
 * 
 * @type Object
 * @description Holds all plugins defined and included into the library
 */
Needle.prototype.plugins = {};
/**
 * @property isIE 
 * @access public
 * 
 * @type Boolean
 * @description Is this IE or not
 */
Needle.prototype.isIE = document.all || false; 
/**
 * @method get 
 * @access public
 * 
 * @description Gets element by Id or returns the parameter if it is not string
 * 
 * @param element String Id
 * 
 * @returns HTMLElement|element
 */
Needle.prototype.get = function(element) {
	return (typeof element === "string") ? document.getElementById(element) : element;
};
/**
 * @method objectMerge 
 * @access public
 * 
 * @description Merges objects. First object will be modified.
 * First object will contain copies of other objects members. 
 * @note Doesn't support function copying
 * 
 * @param obj1 Object (required)
 * @param obj2 Object (required)
 * @param obj2 Object (optional)
 * ...
 * @param objn Object (required)
 * 
 * @returns Object
 */
Needle.prototype.objectMerge = function() {
	var obj = arguments[0], length = arguments.length, j = 0;

	while (++j < length) {
		if (typeof arguments[j] === "object") {
			var i;
			for (i in arguments[j]) {
				switch (typeof arguments[j][i]) {
					case "object": 
						if (arguments[j][i] != null) {
							if (!arguments[j][i].nodeName) {
								obj[i] = this.objectMerge(((typeof obj[i] === "undefined") ? (this.isArray(arguments[j][i]) ? [] : {}) : obj[i]), arguments[j][i]);
								break;
							}
						}
						obj[i] = arguments[j][i];
						break;
					default:
						obj[i] = arguments[j][i];
						break;
				}
			}
		}
	}
	return obj;
};
/**
 * @method isArray 
 * @access public
 * 
 * @description Checks is el is array.
 * 
 * @param el Object|Function|String|Integer|Float|Array|Date... (required)
 * 
 * @returns Boolean
 */
Needle.prototype.isArray = function(el) {
	return (el != null) && (el.constructor == Array);
};
/**
 * @method inArray 
 * @access public
 * 
 * @description Checks if value is in array.
 * @TODO Deep check.
 * 
 * @param value Object|Function|String|Integer|Float|Array|Date... (required)
 * @param array Array (required)
 * 
 * @returns Boolean
 */
Needle.prototype.inArray = function(value, array) {
	var i;
	for (i in array) {
		if (array[i] == value) { return true; }
	}
	return false;
};
/**
 * @method getX 
 * @access public
 * 
 * @description Gets left position of an element.
 * 
 * @param el HTMLElement (required)
 * 
 * @returns Integer
 */
Needle.prototype.getX = function(el) {
	var left = 0;
	while(el != null) {
		left += el.offsetLeft;
		el = el.offsetParent;
	}
	return left;
};
/**
 * @method getY 
 * @access public
 * 
 * @description Gets top position of an element.
 * 
 * @param el HTMLElement (required)
 * 
 * @returns Integer
 */
Needle.prototype.getY = function(el) {
	var top = 0;
	while(el != null) {
		top += el.offsetTop;
		el = el.offsetParent;
	}
	return top;
};
/**
 * @method extendPrototype 
 * @access public
 * 
 * @description Points child prototype to its parent one.
 * @note Use for inheritance. Parent prototype is shared among all child classes.
 * This may lead to collisions if same name properties or/and methods are defined. 
 * 
 * @param child Constructor|Object (required)
 * @param parent Constructor|Object (required)
 * 
 * @returns void
 */
Needle.prototype.extendPrototype = function(child, parent) {
	child.prototype = parent.prototype;
	child.prototype.constructor = child;
};
/**
 * @method extend 
 * @access public
 * 
 * @description Extends classes method.
 * @note Use for inheritance.
 * 
 * TODO Are we going to inherit public static methods as well?
 * 
 * @param child Constructor|Object (required)
 * @param parent Constructor|Object (required)
 * 
 * @returns void
 */
Needle.prototype.extend = function(child, parent) {
	function M() { };
	if (!this.isArray(parent)) {
		M.prototype = parent.prototype;
	} else {
		var i = parent.length;
		while (i--) { this.objectMerge(M.prototype, parent[i].prototype); }
	}
	// parent methods may be in the prototype and in the prototype.parent
	// M.prototype.parent = parent.prototype;
	child.prototype = new M();
	child.prototype.constructor = child;
};
/**
 * @method transplant 
 * @access public
 * 
 * @description Adds class with "to" name to the library and creates load marker.
 * 
 * @param to String (required)
 * @param what Constructor|Object (required)
 * 
 * @returns void
 */
Needle.prototype.transplant = function(to, what) {
	var that = this;
	onReadyCallbacks[to + ".js"] = function() { that[to] = what(); };
	this.loadMarker(to + ".js");
};
/**
 * @method plug 
 * @access public
 * 
 * @description Adds class with "to" name to the library plugins and creates load marker.
 * 
 * @param to String (required)
 * @param what Constructor|Object (required)
 * 
 * @returns void
 */
Needle.prototype.plug = function(to, what) {
	var that = this;
	onReadyCallbacks[to + ".js"] = function() { that.plugins[to] = what(); };
	this.loadMarker(to + ".js");
};
/**
 * @method namespace 
 * @access public
 * 
 * @description Creates namespace within the library.
 * 
 * @param name String (required) - string with namspace\s eg. ("name1 name2 ...")
 * 
 * @returns Object
 */
Needle.prototype.namespace = function(name) {
	var splitted = name.split(".");
	this[splitted[0]] = this[splitted[0]] || {};
	
	(name.indexOf(".") != -1) && window.NEEDLE.namespace.call(this[splitted[0]], name.replace(splitted[0] + ".", ""));
	return this[splitted[0]];
};

Needle.prototype.constructor = null;
window.NEEDLE = new Needle();
})();