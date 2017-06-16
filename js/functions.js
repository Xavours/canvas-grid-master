/************
REQUEST ANIMATION FRAME
************/

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
// Pause and Start added by Xavier Orssaud
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		var RAFisPaused = false;

		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
			|| window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); },
					timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

			if (!window.cancelAnimationFrame)
				window.cancelAnimationFrame = function(id) { 
					clearTimeout(id);
				};
	}());

	// Pause and Start added by Xavier Orssaud
	var request;	// to store the request

	function playRaf(cb) {
		request = requestAnimationFrame(cb);
	}

	function pauseRaf() {
		cancelAnimationFrame(request);
	}

/************
CHECK TYPE OR EXISTENCE
************/

/*  Determine if a node is in page
/  Source : https://developer.mozilla.org/en/docs/Web/API/Node/contains
*/
	function isInPage(node) {
	  return (node === document.body) ? false : document.body.contains(node);
	}

/*  Determine if a variable is an object
/  Source : https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
*/
	Object.toType = (function toType(global) {
	  return function(obj) {
	    if (obj === global) {
	      return "global";
	    }
	    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	  }
	})(this)

/************
MATH & MANIPULATION FUNCTION
************/

	// Shuffle an array
	function shuffle(o) {
		for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}

	//  Pick random number
	function randomPick(min, max) {
		return Math.floor(Math.random() * max) + min;
	}

	//  Return true if even number
	function isEven(n) {
		return n == parseFloat(n) && !(n % 2);
	}

/************
DEBUG FUNCTION
************/

	//  Text for debugging
	function text(indiceX, indiceY, x, y) {
		ctx.font="18px Arial";
		ctx.fillStyle = "black";
		ctx.fillText(indiceX + ' / ' + indiceY, x, y);
	}