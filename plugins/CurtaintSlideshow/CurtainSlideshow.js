NEEDLE.plug("CurtainSlideshow", function() {
/**
 * Extends NEEDLE.BasicOpacity class
 * 
 * Think of a way to create an Interface (php like) for all slideshows
 * in the future. They all share same behaviour.
 */
NEEDLE.extend(CurtainSlideshow, NEEDLE.BasicOpacity);
/**
 * @class CurtainSlideshow 
 * 
 */
function CurtainSlideshow(configuration) {
	this.CurtainSlideshow(configuration);
}
/**
 * @constructor CurtainSlideshow
 * @access public 
 * 
 * @param configuration Object (required)
 * 
 * @returns void
 */
CurtainSlideshow.prototype.CurtainSlideshow = function(configuration) {
	this.BasicOpacity(configuration);
	
	if (typeof configuration == "object") {
		this.holder = NEEDLE.get(configuration.holder || "slideshow");
		this.type = configuration.type || "horizontal";
		this.direction = configuration.direction || ["left"]; 
		this.pieces = configuration.pieces || 30;
		this.speed = configuration.speed || 130;
		this.pause = configuration.pause || 4;
		this.slides = this.blinds = [];
		this.current = this.blindsHolder = null;
		this.inProgress = false;
		
		_init.call(this);
		//_onResize.call(this, configuration);
	}
};

/**
 * @method slide
 * @access public
 * 
 * @description Slides to an exact slide or to a direction 
 * 
 * @param position (string|number)
 * @param callback (function) - optional
 * 
 * @returns CurtainSlideshow instance pointer
 */
CurtainSlideshow.prototype.slide = function(position, callback) {
	if (!this.inProgress) {
		this.inProgress = true;
		_setBlindsBG.call(this);
		_movePointer.call(this, position-1);
		this.effect(callback);
	}
	return this;
};
/**
 * @method effect
 * @access public
 * 
 * @description Defining a slide effect  
 * 
 * @param fn Function callback (optional)
 * 
 * @returns CurtainSlideshow instance pointer
 */
CurtainSlideshow.prototype.effect = function(fn) {
	var that = this, j = this.blinds.length - 1, i = 0;

	if (this.direction == "left") {
		this.blindsHolder.interval = setInterval(function() {
			that.start(that.blinds[i].details, "disappear", (function() { return _callFinish.call(that, i, j, fn); })());
			i++;
		}, this.speed);
		
	} else if (this.direction == "right") {
		this.blindsHolder.interval = setInterval(function() {
			that.start(that.blinds[j].details, "disappear", (function() { return _callFinish.call(that, i, j, fn); })());
			j--;
		}, this.speed);
		
	} else if (this.direction == "center") {
		this.blindsHolder.interval = setInterval(function() {
			that.start(that.blinds[i].details, "disappear", (function() { return _callFinish.call(that, i, j, fn); })());
			that.start(that.blinds[j].details, "disappear", (function() { return _callFinish.call(that, i, j, fn); })());
			i++; j--;
		}, this.speed);
	}
	return this;
};
/**
 * @method play
 * @access public
 * 
 * @description Plays (starts) the slideshow 
 * 
 * @param interval Number (optional)
 * @param callback Function (optional)
 * 
 * @returns CurtainSlideshow instance pointer
 */
CurtainSlideshow.prototype.play = function(interval, callback) {
	var that = this;
	interval = (interval) ? interval : this.pause;
	
	this.blindsHolder.play = setInterval(function() {
		that.slide("next", callback);
	}, interval*1000);
	return this;
};
/**
 * @method stop
 * @access public
 * 
 * @description Stops the slideshow  
 * 
 * @returns CurtainSlideshow instance pointer
 */
CurtainSlideshow.prototype.stop = function() {
	clearInterval(this.blindsHolder.play);
	return this;
};
/**
 * @method _init
 * @access private
 * 
 * @description Initializes slideshow  
 * 
 * @returns void
 */
function _init() {
	_setBlindsHolder.call(this);
	_setSlides.call(this);
	_setBlinds.call(this);
	_setOpacity.call(this);
}
/**
 * @method _setBlindsHolder
 * @access private
 * 
 * @description Creates holder for the blinds
 * 
 * @returns void
 */
function _setBlindsHolder() {
	(this.blindsHolder) && NEEDLE.DOM.remove(this.blindsHolder);
	this.blindsHolder = NEEDLE.DOM.create("div");
}
/**
 * @method _setSlides
 * @access private
 * 
 * @description Sets slides
 * 
 * @returns void
 */
function _setSlides() {
	this.slides = NEEDLE.DOM.getFirstLevelNodes(this.holder); 
	var	images = this.holder.getElementsByTagName("img"), i = this.slides.length; 

	while (i--) {
		this.slides[i].element = this.slides[i];
		this.slides[i].src = images[i].src;
		this.slides[i].id = i;
		this.slides[i].element.style.display = "none";
	}
	this.current = this.current || this.slides[0];
}
/**
 * @method _setBlinds
 * @access private
 * 
 * @description Sets blinds and positions each slide image 
 * 
 * @returns void
 */
function _setBlinds() {
	var size = (this.type == "horizontal") ? this.holder.offsetWidth : this.holder.offsetHeight, 
		pieceSize = parseInt(size/this.pieces),
		difference = size - this.pieces * pieceSize, 
		margin = 0, buffer, i; 

	for (i = 0; i < this.pieces; i++) {
		buffer = (difference-- > 0) ? 1 : 0; 
		this.blinds[i] = [];
		this.blinds[i].element = NEEDLE.DOM.create("div");
		
		NEEDLE.DOM.setStyle(this.blinds[i].element, _options.call(this, { image : this.current.src, margin : margin, buffer : buffer, pieceSize : pieceSize }));
		
		margin += pieceSize + buffer;
		NEEDLE.DOM.add(this.blinds[i].element, this.blindsHolder);
	}
	NEEDLE.DOM.add(this.blindsHolder, this.holder);
	NEEDLE.DOM.setStyle(this.blindsHolder, { width: "100%", height: "100%", position : "absolute", top : 0, left : 0, zIndex : 1 });
}
/**
 * @method _setOpacity
 * @access private
 * 
 * @description Sets opacity effects 
 * 
 * @returns void
 */
function _setOpacity() {
	var length = this.blinds.length, i;
	
	for (i = 0; i < length; i++) {
		this.blinds[i].details = this.set(this.blinds[i].element, null);
	}
}
/**
 * @method _options
 * @access private
 * 
 * @description Sets blinds options (width, height, background position)
 * 
 * @param options Object (required)
 * 
 * @returns Object
 */
function _options(options) {
	var details = { 
		horizontal : {
			position : "absolute", 
			top : 0, 
			left : options.margin + "px", 
			width : options.pieceSize + options.buffer + "px", 
			height : "100%", 
			background : "url(" + options.image + ") -" + (options.margin) + "px 0 no-repeat"}, 
			
		vertical : {
			position : "absolute", 
			top : options.margin + "px", 
			left : 0, 
			width : "100%", 
			height : options.pieceSize + options.buffer + "px", 
			background : "url(" + options.image + ") 0 -" + (options.margin) + "px no-repeat"
		}
	};	
	return details[this.type];
}
/**
 * @method _movePointer
 * @access private
 * 
 * @description Sets internal current slide element after each slide
 * 
 * @param position next|prev|Number (required)
 * 
 * @returns void
 */
function _movePointer(position) {
	this.current.element.style.display = "none";
	
	if (position == "next") {
		this.current = this.slides[this.current.id*1 + 1] || this.slides[0];
	} else if (position == "prev") {
		this.current = this.slides[this.current.id*1 - 1] || this.slides[this.slides.length-1];
	} else if (typeof position == "number") {
		this.current = this.slides[position] || this.slides[0];
	}
	this.current.element.style.display = "block";
}
/**
 * @method _callFinish
 * @access private
 * 
 * @description Hides blinds and call callback function 
 * 
 * @param i Number (required)
 * @param j Number (required)
 * @param callback Function (optional)
 * 
 * @returns Boolean|Function
 */
function _callFinish(i, j, callback) {
	if (i >= j) {
		var that = this;
		this.inProgress = false;
		clearInterval(this.blindsHolder.interval);
		return function() { 
			that.blindsHolder.style.display = "none";
			(typeof callback === "function") && callback();
		};
	}
	return false;
}
/**
 * @method _setBlindsBG
 * @access private
 * 
 * @description Sets blinds image
 * 
 * @returns void
 */
function _setBlindsBG() {
	var i = this.blinds.length, style;
	while (i--) {
		this.reset(this.blinds[i].details);
		style = this.blinds[i].element.style;
		style.display = "none";
		style.backgroundImage = "url(" + this.current.src + ")";
		style.display = "block";
	}
	this.blindsHolder.style.display = "block";
}
/**
 * @method configuration
 * @access private
 * 
 * @description onresize event.
 * 
 * @returns void
 */
function _onResize(configuration) {
	var that = this;
	window.onresize = function() { _init.call(that); };
}

return CurtainSlideshow;
});