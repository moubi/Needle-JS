NEEDLE.transplant("XML", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(XML, NEEDLE.Object);
/**
 * @class XML 
 * 
 */
function XML() {
	this.XML();
}
/**
 * @constructor XML
 * @access public
 * 
 * @returns void
 */
XML.prototype.XML = function() { 
	this.doc = null;
	this.xml = null;
};
/**
 * @method createDocument
 * @access public
 * 
 * @description Creates XML document.
 * 
 * @param root DOMString (required)
 * 
 * @returns XMLDocument
 */
XML.prototype.createDocument = function(root) {
    if (document.implementation && document.implementation.createDocument) {
    	XML.prototype.createDocument = function(root) { return this.doc = document.implementation.createDocument("", root || "", null); };
    } else {
    	XML.prototype.createDocument = function(root) { 
	        this.doc = new ActiveXObject("MSXML2.DOMDocument");
	        (root) && this.doc.loadXML("<" +  root + "/>");
	        return this.doc;
    	};
    }
    return this.createDocument(root);
};
/**
 * @method load
 * @access public
 * 
 * @description Loads XML document from an URL.
 * 
 * @param url String (required) 
 * @param callback Function (optional)
 * @param async Boolean (optional)
 * 
 * @returns Boolean
 */
XML.prototype.load = function(url, callback) {
	var that = this, request = new XMLHttpRequest();
    request.onreadystatechange = function() {
    	if (request.readyState == 4) {
    		that.doc = request.responseXML;
    		that.xml = that.doc.documentElement || that.doc;
    		(typeof callback === "function") && callback.call(that);
    	}
    };
    request.open("GET", url, true);
    request.send(null);
};
/**
 * @method parse
 * @access public
 * 
 * @description Parses XML string into an XMLDocument.
 * 
 * @param text String (required) 
 * 
 * @returns XMLDocument
 */
XML.prototype.parse = function(text) {
    if (typeof DOMParser !== "undefined") {
    	XML.prototype.parse = function(text) { return this.doc = new DOMParser().parseFromString(text, "application/xml"); };
    } else {
    	XML.prototype.parse = function(text) { 
	        var doc = this.createDocument();
	        doc.loadXML(text);
	        return doc; 
    	};
    }
    return this.parse(text);
};
/**
 * @method serialize
 * @access public static
 * 
 * @description Stringifies an XML node.
 * 
 * @param node XMLNode (required) 
 * 
 * @returns String
 */
XML.serialize = function(node) {
    if (typeof XMLSerializer !== "undefined" && typeof node.xml === "undefined") {
    	XML.serialize = function(node) { return new XMLSerializer().serializeToString(node); };
    } else {
    	XML.serialize = function(node) { return node.xml; };
    }
    return XML.serialize(node);
};


return XML;
});