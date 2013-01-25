NEEDLE.plug("MoveSlideshow", function() {
// Extends NEEDLE.Move class
NEEDLE.extend(MoveSlideshow, NEEDLE.Move);
/**
 * @class MoveSlideshow 
 * 
 */
function MoveSlideshow(configuration) {
	this.MoveSlideshow(configuration);
}
/**
 * @constructor MoveSlideshow
 * @access public 
 * 
 * @param configuration Object (required)
 * configuration.type String (horizontal|vertical) (optional)
 * configuration.holder String|HTMLElement (optional)
 * configuration.width Number (optional) 
 * configuration.height Number (optional)
 * configuration.forwardStep Number (optional)
 * configuration.backwardStep Number (optional)
 * configuration.pause Number (optional)
 * configuration.visible Number (optional)
 * 
 * @returns void
 */
MoveSlideshow.prototype.MoveSlideshow = function(configuration) {
	if (typeof configuration === "object" ) {
		this.type = configuration.type || "horizontal";
		configuration.direction = (this.type == "horizontal") ? "x" : "y";
		this.Move(configuration);
		
		this.holder = NEEDLE.get(configuration.holder || "slideshow");
		this.width = configuration.width || 100;
		this.height = configuration.height || 100;
		this.forwardStep = configuration.forwardStep || 30;
		this.backwardStep = configuration.backwardStep || 50;
		this.pause = configuration.pause || 4;
		this.visible = configuration.visible || 1;
		this.slides = this.current = this.wrapper = this.dimension = this.pos = null;
		this.inProgress = false;
		
		_init.call(this);
	}
};
/**
 * @method slide
 * @access public 
 * 
 * @description Slides to a certain slide. 
 * 
 * @param position Number (required)
 * @param callback Function (optional)
 * 
 * @returns void
 */
MoveSlideshow.prototype.slide = function(position, callback) {
	if (!this.inProgress) {
		if (typeof parseInt(position) == "number") {
			var that = this; 
			this.inProgress = true;
			position = parseInt(position);
			
			(position < this.slides.length && position < this.visible) && (position = this.visible);

			if (position > this.current) {
				var sign = -1, howMany = position - this.current, next = position, step = this.forwardStep;
			} else {
				var sign = 1, howMany = this.current - position, next = position, step = this.backwardStep;
			}
			
			this.current = next;
			this.move(this.wrapper, { length : sign*this[this.dimension]*howMany, step : step }, function() {
				that.inProgress = false;
				(typeof callback === "function") && callback.call(that);
			});
		}
	}
};
/**
 * @method next
 * @access public 
 * 
 * @description Slides to the next slide. 
 * 
 * @param callback Function (optional)
 * 
 * @returns void
 */
MoveSlideshow.prototype.next = function(callback) {
	this.slide((this.current != this.slides.length) ? (this.current + 1) : this.visible, callback);
};
/**
 * @method prev
 * @access public 
 * 
 * @description Slides to the previous slide. 
 * 
 * @param callback Function (optional)
 * 
 * @returns void
 */
MoveSlideshow.prototype.prev = function(callback) {
	this.slide((this.current == this.visible) ? this.slides.length : (this.current - 1), callback);
};
/**
 * @method play
 * @access public 
 * 
 * @description Stars autosliding. 
 * 
 * @param time Number (optional)
 * @param callback Function (optional)
 * 
 * @returns void
 */
MoveSlideshow.prototype.play = function(time, callback) {
	var that = this;
	time = time || this.pause;
	
	this.wrapper.interval = setInterval(function() {
		that.next(callback);
	}, time*1000);
};
/**
 * @method stop
 * @access public 
 * 
 * @description Stops autosliding. 
 * 
 * @returns void
 */
MoveSlideshow.prototype.stop = function() {
	clearInterval(this.wrapper.interval);
};
/**
 * @method _init
 * @access private 
 * 
 * @description Prepare slides and holder based on HTML structure. 
 * 
 * @returns void
 */
function _init() {
	this.slides = NEEDLE.DOM.getFirstLevelNodes(this.holder);
	var l =  this.slides.length, i;
	if (l > 0) {
		_setType.call(this);
		_createSlidesHolder.call(this);
		
		this.current = this.visible;
		for (i = 0; i < l; i++) {
			_prepareSlides.call(this, i);
		}
	}
};
/**
 * @method _setType
 * @access private 
 * 
 * @description Preparation based on orientation. 
 * 
 * @returns void
 */
function _setType() {
	if (this.type == "horizontal") {
		this.dimension = "width";
		this.pos = "left";

	} else if (this.type == "vertical") {
		this.dimension = "height";
		this.pos = "top";
	}
}
/**
 * @method _createSlidesHolder
 * @access private 
 * 
 * @description Creates holder for the slides. 
 * 
 * @returns void
 */
function _createSlidesHolder() {
	this.wrapper = NEEDLE.DOM.create("div");
	NEEDLE.DOM.add(this.wrapper, this.holder);
	NEEDLE.DOM.setStyle(this.wrapper, { position : "absolute", left : 0, top : 0, width : "100%", height : "100%" });
}
/**
 * @method _prepareSlides
 * @access private 
 * 
 * @description Position each slide. 
 * 
 * @param i Number (required)
 * 
 * @returns void
 */
function _prepareSlides(i) {
	var that = this;
	
	NEEDLE.DOM.remove(this.slides[i]);
	NEEDLE.DOM.setStyle(this.slides[i], new function() {
		this.position = "absolute";
		this[that.pos] = that[that.dimension]*(i) + "px";
	});
	NEEDLE.DOM.add(this.slides[i], this.wrapper);
}

return MoveSlideshow;
});