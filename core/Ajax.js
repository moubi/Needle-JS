NEEDLE.transplant("Ajax", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(Ajax, NEEDLE.Object);
/**
 * @class Ajax 
 * 
 */
function Ajax() {
	this.Ajax();
}
/**
 * @constructor Ajax
 * @access public
 * 
 * @returns void
 */
Ajax.prototype.Ajax = function() {
	this.xhr = null;
};
/**
 * @method isSupported
 * @access public
 * 
 * @description Checks if XMLHttpRequest is present (supported) 
 * by the current browser.
 * 
 * @returns Boolean
 */
Ajax.prototype.isSupported = function() {
	return (typeof XMLHttpRequest != "undefined");
};
/**
 * @method request
 * @access public
 * 
 * @description Opens get or post connection to the server.
 * Sends and receives response. Calls callback function.
 * 
 * @param url String (required)
 * @param method String (get|post) (required)
 * @param callback Function (required)
 * @param params String (optional)
 * @returns XMLHttpRequest instance
 */
Ajax.prototype.request = function(url, method, callback, params) {
	_xhrInstance.call(this);
	this.xhr.onreadystatechange = function() { 
		_callback.call(this, callback); 
	};
	_openConnection.call(this, method, url, params);
	return this.xhr;
};
/**
 * @method getReadyState
 * @access public
 * 
 * @description Returns readyState code of the current request.
 * 
 * @returns Integer
 */
Ajax.prototype.getReadyState = function() {
    return this.xhr.readyState;
};
/**
 * @method getStatusCode
 * @access public
 * 
 * @description Returns status code of the current request.
 * 
 * @returns Integer
 */
Ajax.prototype.getStatusCode = function() {
    return this.xhr.status;
};
/**
 * @method getResponseText
 * @access public
 * 
 * @description Returns responseText of the current request if it has been received.
 * 
 * @returns String|void
 */
Ajax.prototype.getResponseText = function() {
    if (this.getReadyState() == 4) {
        return this.xhr.responseText;
    }
};
/**
 * @method getResponseXML
 * @access public
 * 
 * @description Returns response XML of the current request if it has been received.
 * 
 * @returns String|void
 */
Ajax.prototype.getResponseXML = function() {
    if (this.getReadyState() == 4) {
        return this.xhr.responseXML;
    }
};
/**
 * @method abort
 * @access public
 * 
 * @description Aborts current request.
 * 
 * @returns void
 */
Ajax.prototype.abort = function() {
	(this.xhr != null) && this.xhr.abort();
};
/**
 * @method getRequest
 * @access public
 * 
 * @description Returns current XMLHttpRequest instance.
 * 
 * @returns XMLHttpRequest instance
 */
Ajax.prototype.getRequest = function() {
	return this.xhr;
};

/**
 * @method _openConnection
 * @access private
 * 
 * @description Opens GET or POST connection to the server.
 * 
 * @param method String (get|post) (required)
 * @param url String (required)
 * @param params String (optional)
 * @returns void
 */
function _openConnection(method, url, params) {
	switch(method) {
		case "post":
			_queryPost.call(this, url, params);
			break;
		case "get":
			_queryGet.call(this, url);
			break;
		default:
			alert("Specify data conection method (post or get)");
	}
}
/**
 * @method _callback
 * @access private
 * 
 * @description Executes callback function if request is finished successfully.
 * 
 * @param fn Function (optional)
 * @returns void
 */
function _callback(fn) {
    if (this.readyState == 4) {
    	if (this.status == 200) {
            (typeof fn == "function") && fn();
        }
    }
}
/**
 * @method _queryGet
 * @access private
 * 
 * @description Opens GET connection to the server.
 * 
 * @param url String (required)
 * @returns void
 */
function _queryGet(url) {
    try {
        this.xhr.open("GET", url, true);
        this.xhr.send(null);
    } catch(ex) {
        throw ex;
    }
}
/**
 * @method _queryPost
 * @access private
 * 
 * @description Opens POST connection to the server and passes parameters (name=value).
 * 
 * @param url String (required)
 * @param query String (required)
 * @returns void
 */
function _queryPost(url, query) {
	var xhr = this.xhr;
    try {
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      	xhr.setRequestHeader("Content-length", query.length);
      	xhr.setRequestHeader("Connection", "close");
        xhr.send(query);
    } catch(ex) {
        throw ex;
    }
}
/**
 * @method _xhrInstance
 * @access private
 * 
 * @description Makes XMLHttpRequest instance if supported.
 * 
 * @returns void
 */
function _xhrInstance() {
    if (this.isSupported()) {
    	this.xhr = new XMLHttpRequest();
    } else {
    	alert("Your browser is too old.");
    }
}

return Ajax;
});