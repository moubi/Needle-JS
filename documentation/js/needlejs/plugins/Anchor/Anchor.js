NEEDLE.plug("Anchor", function() {
function Anchor(element, event, position, callback) { 
	this.Anchor(element, event, position, callback);
}
Anchor.prototype.Anchor = function(element, event, position, callback) {
	NEEDLE.Events.addEventListener(NEEDLE.get(element), event, function(e) {
		NEEDLE.Events.preventDefault(e);
		Anchor.scrollTo(position.x, position.y, callback);
	});
};
Anchor.scrollTo = function(x, y, callback) {
	var i = Math.max(document.documentElement.scrollTop, document.body.scrollTop),  
		sign = (i > y) ? 1 : -1, factor = 1;

	var interval = setInterval(function() {
		if (sign*i >= sign*y) {
			scrollTo(x, i);
		} else {
			clearInterval(interval);
			scrollTo(x, y);
			(typeof callback === "function") && callback();
		}
		i -= sign*3*factor++;
	}, 20);
};

return Anchor;
});