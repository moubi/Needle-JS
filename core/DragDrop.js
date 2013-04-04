NEEDLE.transplant("DragDrop", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(DragDrop, NEEDLE.Object);
/**
 * @class DragDrop 
 * 
 */
function DragDrop(box, handle) {
    this.DragDrop(box, handle);
}
/**
 * @constructor DragDrop
 * @access public
 * 
 * @param box HTMLElement|String (required)
 * @param handle HTMLElement|String (required)
 * @returns void
 */
DragDrop.prototype.DragDrop = function(box, handle) {
	this.box = NEEDLE.get(box); 
    this.handle = NEEDLE.get(handle);
    
    this.mouseDownFlag = false;
    this.objectWindow = {}; 
	this.delta = { x : 0, y : 0 };
	this.mousePos = { x : 0, y : 0 };
};
/**
 * @method mouseMove
 * @access public
 * 
 * @description Moves an element (box) onmousedown.
 * @note If handle is empty element it may happen, so that it stops moving the box.
 * 
 * @param e EventObject (required)
 * @returns current instance
 */
DragDrop.prototype.mouseMove = function(e) {
    _getMouseXY.call(this, e);
    if (this.mouseDownFlag) {
    	this.box.style.top = this.objectWindow.y + this.delta.y + "px";
    	this.box.style.left = this.objectWindow.x + this.delta.x + "px";

        this.objectWindow.y += this.delta.y;
        this.objectWindow.x += this.delta.x;
    }
    return this;
};
/**
 * @method mouseDown
 * @access public
 * 
 * @description Called onmousedown, prepares element (box) to be moved.
 * @param e EventObject (required)
 * 
 * @returns current instance
 */
DragDrop.prototype.mouseDown = function(e) {		
	var style = this.box.style;
	this.mouseDownFlag = true;
	
	style.position = "absolute"; 
	style.zIndex = 10000;
	this.objectWindow = { x : parseInt(style.left), y : parseInt(style.top) };
	this.mousePos = this.mouse(e);
	
	return this;
};
/**
 * @method mouseUp
 * @access public
 * 
 * @description Indicates that mouse button is released.
 * 
 * @returns current instance
 */
DragDrop.prototype.mouseUp = function() {		
	this.mouseDownFlag = false;
	return this;
};
/**
 * @method open
 * @access public
 * 
 * @description Prepares HTML element (box) to be moved from a certain position.
 * This method can be called if element is not set to an absolute position - otherwise can be skipped.
 * 
 * @returns current instance
 */
DragDrop.prototype.open = function() {
	this.box.style.top = NEEDLE.getY(this.box) + "px";
	this.box.style.left = NEEDLE.getX(this.box) + "px";
	return this;
};
/**
 * @method mouse
 * @access public
 * 
 * @description Gets cursor position based on browser 
 * @param e EventObject (required)
 * 
 * @returns current instance
 */
DragDrop.prototype.mouse = function(e) {
	if(NEEDLE.isIE) {
		DragDrop.prototype.mouse = function(e) { return { x : event.clientX + document.body.scrollLeft, y : event.clientY + document.body.scrollTop }; };
    } else {
    	DragDrop.prototype.mouse = function(e) { return { x : e.pageX, y : e.pageY }; };
    }
	return this.mouse(e);
};
/**
 * @method _getMouseXY
 * @access private
 * 
 * @description Gets mouse cursor's coordinates and sets internal variables.
 * 
 * @param e EventObject (required)
 * @returns void
 */
function _getMouseXY(e) {
	var mouse = this.mouse(e);
    this.delta = { x : mouse.x - this.mousePos.x, y : mouse.y - this.mousePos.y };
    this.mousePos = { x : mouse.x, y : mouse.y };    
};

return DragDrop;
});