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
    
    this.x = this.y = 0;
    this.mouseDownFlag = false;
    this.objectWindow = {}; 
	this.delta = { x : 0, y : 0 };
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
 * 
 * @returns current instance
 */
DragDrop.prototype.mouseDown = function() {		
	var style = this.box.style;
	this.mouseDownFlag = true;
	
	style.position = "absolute"; 
	style.zIndex = 10000;
	this.objectWindow = {
        x : parseInt(style.left),
        y : parseInt(style.top)
    };
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
 * @description Prepares HTML element (box) to be moved from a certain position - elementToOpenOn.
 * 
 * @param elementToOpenOn HTMLElement (optional)
 * @returns current instance
 */
DragDrop.prototype.open = function(elementToOpenOn) {
	if (!elementToOpenOn) {
		this.box.style.top = NEEDLE.getY(this.box) + "px";
		this.box.style.left = NEEDLE.getX(this.box) + "px";
	} else {
		this.box.style.top = (NEEDLE.getY(elementToOpenOn) - this.box.offsetHeight / 2) + "px";
		this.box.style.left = (NEEDLE.getX(elementToOpenOn) - this.box.offsetWidth / 2) + "px";
	}
	return this;
};
/**
 * @method _getMouseXY
 * @access private
 * 
 * @description Gets mouse cursor's coordinates.
 * 
 * @param e EventObject (required)
 * @returns void
 */
function _getMouseXY(e) {
    if(NEEDLE.isIE) {
        var mouseX = event.clientX + document.body.scrollLeft, 
        	mouseY = event.clientY + document.body.scrollTop;
    } else {
        var mouseX = e.pageX, mouseY = e.pageY;
    }
    this.delta.x = mouseX - this.x;
    this.delta.y = mouseY - this.y;

    this.x = mouseX;
    this.y = mouseY;    
};

return DragDrop;
});