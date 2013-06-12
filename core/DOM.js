NEEDLE.transplant("DOM", function() {
/**
 * @class DOM 
 * 
 */
var DOM = NEEDLE.Sizzle || function() {};
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(DOM, NEEDLE.Object);

/**
 * @method create
 * @access public static
 * 
 * @description Creates HTML element by setting or not namespace, adds attributes and returns it.
 * 
 * @param element String (required) - div:http://namespace.com
 * @param attributes Object (optional)
 * 
 * @returns HTMLElement
 */
DOM.create = function(element, attributes) {
	element = element.split(":");
	element[0] = (!element[1]) ? document.createElement(element[0]) : document.createElementNS(element[1], element[0]);
	(typeof attributes !== "undefined") && DOM.setAttributes(element[0], attributes, element[1]);
	return element[0];
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
 * @method setAttributes
 * @access public static
 * 
 * @description Sets HTML/SVG/XML element's attributes by using or not namespace.
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
			(i == "className") && (i = "class");
			element.setAttribute(i, value);
		}
	} else {
		for (i in attributes) { element.setAttributeNS(ns, i, attributes[i]); }
	}
	return DOM;
};
/**
 * @method getAttributes
 * @access public static
 * 
 * @description Returns attributes of an HTML/SVG/XML element.
 * 
 * @param element HTMLElement (required)
 * @param params String|Object (required)
 * @returns Array (name=value)
 */
DOM.getAttributes = function(element, params, ns) {
	if (typeof params === "string") {
		return (typeof ns == "undefined") ? element.getAttribute(params) : element.getAttributeNS(ns, params);
		
	} else if (typeof params === "object") {
		var i = params.length, collection = {};
		if (typeof ns == "undefined") {
			while (i--) { collection[params[i]] = element.getAttribute(params[i]); }
		} else {
			while (i--) { collection[params[i]] = element.getAttributeNS(ns, params[i]); }
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
 * @method style
 * @access public static
 * 
 * @description Sets style of an HTML element.
 * 
 * @param element HTMLElement (required)
 * @param properties Object (required)
 * @returns false|DOM class
 */
DOM.style = function(element, properties) {
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
	if (typeof elements === "object") {
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
	if (typeof elements === "object") {
		var fragment = document.createDocumentFragment(), i;
		for (i in elements) {
			DOM.add(elements[i], fragment);
		}
		DOM.add(fragment, destination);
	}
	return DOM;
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
DOM.getX = function(el) {
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
DOM.getY = function(el) {
	var top = 0;
	while(el != null) {
		top += el.offsetTop;
		el = el.offsetParent;
	}
	return top;
};

return DOM;
});