//  Easing Equations by RObert Penner
//  http://gizma.com/easing/

	function easeOutCubic(t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	}
	function easeOutQuart(t, b, c, d) {
	    t /= d;
	    t--;
	    return -c * (t*t*t*t - 1) + b;
	};
	function easeInOutSine(t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}

	function easeCustom(t, b, c, d) {
		return c + Math.floor((b - c) /20);
	}