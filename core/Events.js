NEEDLE.transplant("Events", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(Events, NEEDLE.Object);
/**
 * @class Events 
 * 
 */
function Events() {
	this.Events();
};

function _get(element) {
	return (NEEDLE.isArray(element)) ? element : [NEEDLE.get(element)];
};
/**
 * @constructor Events
 * @access public
 * 
 * @returns void
 */
Events.prototype.Events = function() { };
/**
 * @method getEvent
 * @access public static
 * 
 * @description Cross browser get event method
 * 
 * @param e EventObject (required)
 * @returns EventObject
 */
Events.getEvent = function(e) {
    return e || window.event;
};
/**
 * @method getTarget
 * @access public static
 * 
 * @description Cross browser gets HTML element event has been started at.
 * 
 * @param e EventObject (required)
 * @returns HTMLElement
 */
Events.getTarget = function(e) {
    e = Events.getEvent(e);
    return e.target || e.srcElement;
};
/**
 * @method relatedTarget
 * @access public static
 * 
 * @description Cross browser gets HTML element to/from which cursor goes/comes.
 * 
 * @param e EventObject (required)
 * @returns HTMLElement
 */
Events.relatedTarget = function(e) {
	e = Events.getEvent(e);
	return e.relatedTarget || ((e.type == "mouseout") ? e.toElement : e.fromElement);
};
/**
 * @method stopPropagation
 * @access public static
 * 
 * @description Cross browser stop event of propagation.
 * 
 * @param e EventObject (required)
 * @returns void
 */
Events.stopPropagation = function(e) {
	if (!document.all) {
		Events.stopPropagation = function(e) {
			Events.getEvent(e).stopPropagation();
		};	
	} else {
		Events.stopPropagation = function(e) {
			e = Events.getEvent(e);
			e.cancelBubble = true;	
		};
	}
	Events.stopPropagation(e);
};
/**
 * @method preventDefault
 * @access public static
 * 
 * @description Cross browser prevents element default behaviour.
 * 
 * @param e EventObject (required)
 * @returns void
 */
Events.preventDefault = function(e) {
    if (!document.all) {
    	Events.preventDefault = function(e) {
    		e.preventDefault();
    	};	
    } else {
    	Events.preventDefault = function(e) {
    		window.event.returnValue = false;     
    	};
    }
    Events.preventDefault(e);
};
/**
 * @method addEventListener
 * @access public static
 * 
 * @description Cross browser adds listener for an event DOM Level 2.
 * 
 * @param element Array|String|HTMLElement (required) - Element Id, Array of elements or HTMLElement to listen on
 * @param eventName String (required) - Event name
 * @param fn Function (required) - function to execute on onEvent
 * @param prop Boolean (optional) - propagate or not
 * @returns void
 */
Events.addEventListener = function(element, eventName, fn, prop) {	
	if (typeof window.addEventListener === "function") { // FF
		Events.addEventListener = function(element, eventName, fn, prop) {
			element = _get(element);
			if (typeof fn === "function") {
				var i = element.length;
				while (i--) {
					element[i].addEventListener(eventName, fn, !!prop);					
				}
			}
		};
	} else if (typeof document.attachEvent === "object") {		
		Events.addEventListener = function(element, eventName, fn, prop) {
			element = _get(element);			
			if (typeof fn === "function") {
				var i = element.length;
				while (i--) {
					element[i].attachEvent("on" + eventName, fn);
		        }
			}    
		};
	}
	Events.addEventListener(element, eventName, fn, prop);
};
/**
 * @method removeEventListener
 * @access public static
 * 
 * @description Cross browser removes previously set event listener DOM Level 2.
 * 
 * @param element Array|String|HTMLElement (required) - Element Id, Array of elements or HTMLElement to listen on
 * @param eventName String (required) - Event name
 * @param fn Function (required) - same function as on addEventListener
 * @param prop Boolean (optional) - propagate or not
 * @returns void
 */
Events.removeEventListener = function(element, eventName, fn, prop) {
	if (typeof window.removeEventListener === "function") { // FF
		Events.removeEventListener = function(element, eventName, fn, prop) {
			element = _get(element);
			if (typeof fn === "function") {
				var i = element.length;
				while (i--) {
					element[i].removeEventListener(eventName, fn, !!prop);
				}
			}
		};	
	} else if (typeof document.detachEvent === "object") {
		Events.removeEventListener = function(element, eventName, fn, prop) {
			element = _get(element);
			if (typeof fn === "function") {
				var i = element.length;
				while (i--) {
		        	element[i].detachEvent("on" + eventName, fn);
		        }
			}    
		};
	}
	Events.removeEventListener(element, eventName, fn, prop);
};

return Events;
});