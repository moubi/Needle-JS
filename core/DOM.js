NEEDLE.transplant("DOM", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(DOM, NEEDLE.Object);
/**
 * @class DOM 
 * 
 */
function DOM() {
	this.DOM();
}
/**
 * @constructor DOM
 * @access public
 * 
 * @returns void
 */
DOM.prototype.DOM = function() {};
/**
 * @method create
 * @access public static
 * 
 * @description Creates and returns HTML element by setting or not namespace.
 * 
 * @param element String (required)
 * @param ns String (optional)
 * @returns HTMLElement
 */
DOM.create = function(element, ns) {
	return (typeof ns == "undefined") ? document.createElement(element) : document.createElementNS(ns, element);
};
/**
 * @method createTextNode
 * @access public static
 * 
 * @description Creates and returns HTML textnode.
 * 
 * @param element String (required)
 * @returns HTMLElement
 */
DOM.createTextNode = function(element) {
	return document.createTextNode(element);
};
/**
 * @method createPlus
 * @access public static
 * 
 * @description Creates HTML element, sets attributes to it and returns it.
 * 
 * @param element String (required)
 * @param attributes Object (required)
 * @param ns String (optional)
 * @returns HTMLElement
 */
DOM.createPlus = function(element, attributes, ns) {
	element = DOM.create(element, ns);
	DOM.setAttributes(element, attributes, ns);
	return element;
};
/**
 * @method setAttributes
 * @access public static
 * 
 * @description Sets HTML element's attributes by using or not namespace.
 * 
 * @param element HTMLElement (required)
 * @param attributes Object (required)
 * @param ns String (optional)
 * @returns DOM class
 */
DOM.setAttributes = function(element, attributes, ns) {
	var value, i;
	if (typeof ns == "undefined") {
		for (i in attributes) {
			value = attributes[i];
			(i == "class") && (i = "className");
			element[i] = value;
		}
	} else {
		for (i in attributes) {
			element.setAttributeNS(ns, i, attributes[i]);
		}
	}
	return DOM;
};
/**
 * @method getAttributes
 * @access public static
 * 
 * @description Returns attributes of an HTML element.
 * 
 * @param element HTMLElement (required)
 * @param params String|Object (required)
 * @returns Array (name=value)
 */
DOM.getAttributes = function(element, params) {
	if (typeof params === "string") {
		return element.attributes[params];
		
	} else if (typeof params === "object") {
		var i = params.length, collection = {};
		while (i--) {
			collection[params[i]] = element.attributes[params[i]];
		}
		return collection;
	}
};
/**
 * @method removeAttributes
 * @access public static
 * 
 * @description Removes attributes of an HTML element.
 * 
 * @param element HTMLElement (required)
 * @param params String|Object (required)
 * @returns DOM class
 */
DOM.removeAttributes = function(element, params) {
	if(typeof params === "string") {
		element.removeAttribute(params);
		
	} else if (typeof params === "object") {
		var i = params.length;
		while (i--) {
			element.removeAttribute(params[i]);
		}
	}
	return DOM;
};
/**
 * @method setStyle
 * @access public static
 * 
 * @description Sets style of an HTML element.
 * 
 * @param element HTMLElement (required)
 * @param properties Object (required)
 * @returns false|DOM class
 */
DOM.setStyle = function(element, properties) {
	if (typeof properties === "object") {
		var style = element.style, i;
		for (i in properties) {
			style[i] = properties[i];
		}
		return DOM;
	}
	return false;
};
/**
 * @method add
 * @access public static
 * 
 * @description Appends HTML element in to the document as a child of destination element.
 * 
 * @param element HTMLElement (required)
 * @param destination HTMLElement (required)
 * @returns DOM class
 */
DOM.add = function(element, destination) {
	destination.appendChild(element);
	return DOM;
};
/**
 * @method remove
 * @access public static
 * 
 * @description Removes an HTML element from document and returns it.
 * 
 * @param element HTMLElement (required)
 * @returns HTMLElement
 */
DOM.remove = function(element) {
	return element.parentNode.removeChild(element);
};
/**
 * @method insertBefore
 * @access public static
 * 
 * @description Inserts HTML element in to the document before a certain element (before).
 * 
 * @param element HTMLElement (required)
 * @param before HTMLElement (required)
 * @returns DOM class
 */
DOM.insertBefore = function(element, before) {
	before.parentNode.insertBefore(element, before);
	return DOM;
};
/**
 * @method copy
 * @access public static
 * 
 * @description Copies elements passed and packs them in a fragment.
 * 
 * @param elements HTMLElements (required)
 * @returns DocumentFragment
 */
DOM.copy = function(elements) {
	var fragment = document.createDocumentFragment(), i;
	if (typeof elements == "object") {
		for (i in elements) {
			DOM.add(elements[i].cloneNode(true), fragment);
		}
	}
	return fragment;
};
/**
 * @method cut
 * @access public static
 * 
 * @description Moves elements passed to a destination.
 * 
 * @param elements HTMLElements (required)
 * @param destination HTMLElement (required)
 * @returns DOM class
 */
DOM.cut = function(elements, destination) {
	if (typeof elements == "object") {
		var fragment = document.createDocumentFragment(), i;
		for (i in elements) {
			DOM.add(elements[i], fragment);
		}
		DOM.add(fragment, destination);
	}
	return DOM;
};
/**
 * @method getFirstLevelNodes
 * @access public static
 * 
 * @description Returns all first level elements|nodes information 
 * within an HTMLElement|XMLNode except textNodes and HTML Comments.
 * 
 * @param node HTMLElement|XMLNode (required)
 * @returns Array
 */
DOM.getFirstLevelNodes = function(node) {
	var collection = [],
		nodes = node.childNodes, 
		i = nodes.length, 
		escapeTypes = {3 : 0, 8 : 0};
	
	while (i--) {
		(!(nodes[i].nodeType in escapeTypes)) && collection.push(nodes[i]);
    }
	return collection.reverse();
};
/**
 * @method getElementsByClassName
 * @access public static
 * 
 * @description Returns all elements with a tag having a className|s 
 * within certain HTML element.
 * @note On RegEx className should not contain space at the end as the regex is looking for such.
 * 
 * TODO Make RegEx more efficient if possible. 
 * TODO RegEx requires further testing.
 * 
 * @param className String (required)
 * @param context HTMLElement|document (required)
 * @param tag String (optional)
 * @returns Array
 */
DOM.getElementsByClassName = function(className, context, tag) {	
	if (document.getElementsByClassName) {
		DOM.getElementsByClassName = function(className, context, tag) {
			tag = tag || "*";
			context = context || document;
			
			var elements = context.getElementsByClassName(className);
			if (tag != "*") {
				var buffer = [], i = elements.length;
				while (i--) {
					(elements[i].nodeName == tag.toUpperCase()) && buffer.push(elements[i]);
				}
				elements = buffer.reverse();
			}
			return Array.prototype.slice.call(elements, 0);
		};
	} else {
		DOM.getElementsByClassName = function(className, context, tag) {
			tag = tag || "*";
			context = context || document;
			
			var elements = context.getElementsByTagName(tag), 
				i = elements.length, returnElements = [];
			
			while (i--) {
				(new RegExp("^([\\d\\D\\S]+\\s)*" + className + "(\\s+|\\s+[\\d\\D\\S]+)*$").test(elements[i].className)) && returnElements.push(elements[i]);
			}
			return returnElements.reverse();
		};
	}
	return DOM.getElementsByClassName(className, context, tag);
};
/**
 * @method getElementsByAttribute
 * @access public static
 * 
 * @description Returns all elements with a tag having an attribute 
 * and/or attribute value within certain HTML element.
 * 
 * @param attribute String (required)
 * @param value String|null (required)
 * @param context HTMLElement|document (required)
 * @param tag String (optional)
 * @returns Array
 */
DOM.getElementsByAttribute = function(attribute, value, context, tag) {
	tag = tag || "*";
	context = context || document;
	value = (typeof value == "string") ? value : null;
	
	var elements = context.getElementsByTagName(tag), 
		i = elements.length, returnElements = [];

	while (i--) {
		_getElementByAttribute(elements[i], attribute, value, returnElements);
	}
	return returnElements.reverse();
};

/**
 * @method _getElementByAttribute
 * @access private
 * 
 * @description Fills Array with HTML elements matching parameters passed.
 * @note On RegEx attribute value should not contain space at the end as the regex is looking for such.
 * @note There is a IE7 promblem - it has all possible attributes for an element in its attributes collection.
 * So there is no way to distinguish if an attribute has been set with empty value or has not been set at all.
 * 
 * TODO Make RegEx more efficient if possible.
 * TODO RegEx requires further testing.
 * 
 * @param element HTMLElement (required)
 * @param attribute String (required)
 * @param value String|null (required)
 * @param returnElements Array (required)
 * @returns void
 */
function _getElementByAttribute(element, attribute, value, returnElements) {
	if (element[attribute] != "") {
		if (value != null) {
			new RegExp("^([\\d\\D\\S]+\\s)*" + value + "(\\s+|\\s+[\\d\\D\\S]+)*$").test(element[attribute]) && returnElements.push(element);
		} else {
			returnElements.push(element);
		}
	}
}

return DOM;
});