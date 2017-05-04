// event handlers

	var el = document.getElementById('viewport');
	
	// create a simple instance
	// by default, it only adds horizontal recognizers
	var eventHandler = new Hammer(el);
	
	// let the pan gesture support all directions.
	// this will block the vertical scrolling on a touch-device while on the element
	eventHandler.get('pan').set({ direction: Hammer.DIRECTION_ALL });
	eventHandler.get('pinch').set({ enable: true });
	eventHandler.get('rotate').set({ enable: true });
	
	// listen to events...
	/*
eventHandler.on("panleft panright panup pandown tap press pinch rotate", function(ev) {
	    console.log(ev.type +" gesture detected.");
	});
*/

/////////
//  Mouse control functions
/////////

	//  Initialize variable
		var lastX, lastY;
		var deltaX = 0;
		var deltaY = 0;
		var intervalCounter = 0;
		var startWheel, lastWheel, diffWheel;
		startWheel = lastWheel = new Date();
		var pinchSensitivity = 6 / 100000;
		
	function OpenInNewTab(url) {
		var win = window.open(url, '_blank');
		win.focus();
	}
	
	//  Work around because of Firefox / IE / opera
	function applyWheel(e){
	    var evt = window.event || e 									//equalize event object
	    var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta 		//check for detail first so Opera uses that instead of wheelDelta
	    
	    //  If you start wheeling the mouse stock for the first time since 3 seconds, update viewportX, Y
	    	startWheel = new Date();
	    	diffWheel = (startWheel- lastWheel) / 1000;

	    console.log(delta);

	    wall.goScale(delta);
	}


/////////
//  Keyboard control functions
/////////


/////////
//   Bind Gamepad control
/////////

	var tileCentered;
	var lastTileCentered;

	// Gamepad detection	
	var gamepad = new Gamepad();

	gamepad.on('connect', function (e) {
		console.log('controller ' + e.index + ' connected!');
	});

	gamepad.on('disconnect', function (e) {
		console.log('controller ' + e.index + ' disconnected!');
	});


/////////
//  Set triggers methods
/////////

	Wall.prototype.setTrigger = function () {
		var self = this;

		//  Mouse controls are binded only if in the settings 'controller' is set on 'mouse'
		if (this.settings.controller == 'mouse') {

			//  Bind pan to scroll in any direction
			eventHandler.on("panstart", function(e) {

				lastX = e.center.x;
				lastY = e.center.y;

			});
			
			eventHandler.on("panmove", function(e) {

				deltaX = lastX - e.center.x;
				deltaY = lastY - e.center.y;

				self.goTranslate(deltaX, deltaY);    

				lastX = e.center.x;
				lastY = e.center.y;

			});
			
			eventHandler.on("panend", function(e) {

		        //  When you finish paning, update viewportX, Y
		        //  Wait 0.5 sec to update it though cause the movement might not be finished when you stop paning                 
		        
		    });
			
			//  Bind mousewheel to scale
			//  FF doesn't recognize mousewheel as of FF3.x
			var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" 

			//  if IE (and Opera depending on user setting)
			if (el.attachEvent)
				el.attachEvent("on"+mousewheelevt, applyWheel)

				//  WC3 browsers
				else if (el.addEventListener)
					el.addEventListener(mousewheelevt, applyWheel, false);

			//  Bind click
			eventHandler.on("tap", function(e) {

				var target = self.getTile(e.center.x, e.center.y)
				self.onClick(target);

			});
			
			
			//  Bind hover
			el.addEventListener('mousemove', function(e) {

				var target = self.getTile(e.pageX, e.pageY);
				self.onMouseover(target);

			});
			
			
			//  Bind pinch
			eventHandler.on("pinchin", function(e) {

				self.goScale(e.scale);

			});
			
			eventHandler.on("pinchout", function(e) {

				self.goScale(-e.scale);

			});
		}	

		//  Keyboard controls are binded only if in the settings 'controller' is set on 'keyboard'
		if (this.settings.controller == 'keyboard') {
			$(document).keydown(function (e) {
				switch (e.which) {

					case 37:
				        // left
				        self.goTranslate(-self.settings.moveStep, 0);
				        break;

				        case 38:
				        // up
				        self.goTranslate(0, self.settings.moveStep);
				        break;

				        case 39:
				        // right
				        self.goTranslate(self.settings.moveStep, 0);
				        break;

				        case 40:
				        // down
				        self.goTranslate(0, -self.settings.moveStep);
				        break;

				        case 79:
				        // "o" -->>>  zoom in
				        self.goScale(100);
				        break;

				        case 80:
				        // "p" -->>>  zoom out
				        self.goScale(-100);
				        break;

				        default:
				        return; // exit this handler for other keys
				    }
				e.preventDefault(); // prevent the default action (scroll / move caret)
			});
		}

		// Gamepad controls are binded only if in the settings 'controller' is set on 'gamepad'
		if (this.settings.controller == 'gamepad') {

			// Cross
			gamepad.on('press', 'button_1', function () {
				console.log('Button cross was pressed!');
				self.settings.onPressButton1Callback(tileCentered);
			});

			// Circle
			gamepad.on('press', 'button_2', function () {
				console.log('Button circle was pressed!');
				self.settings.onPressButton2Callback();
			});

			// Square
			gamepad.on('press', 'button_3', function () {
				console.log('Button square was pressed!');
				self.settings.onPressButton3Callback();
			});

			// Triangle
			gamepad.on('press', 'button_4', function () {
				console.log('Button triangle was pressed!');
				self.settings.onPressButton4Callback();
			});

			// Analog left
			gamepad.on('hold', 'stick_axis_left', function (e) {
				//console.log(e.button + ' was pressed!');
				//  Update PositionX
				self.goTranslate(e.value[0]*5, e.value[1]*5);

				tileCentered = self.getTile(self.width/2, self.height/2);
				tileCentered.focus = true;

				if ( isEmpty(lastTileCentered) ) {
					lastTileCentered = tileCentered;
				} else if (tileCentered !== lastTileCentered) {
					lastTileCentered.focus = false;
					lastTileCentered = tileCentered;
				}

			});

			// Analog right
			gamepad.on('hold', 'stick_axis_right', function (e) {
				//console.log(e.button + ' was pressed!');
				self.goScale(-e.value[1]*10);
			});

			// D-Pad Up
			gamepad.on('hold', 'd_pad_up', function (e) {
				console.log(e.button + ' was pressed!');
				self.settings.onPressDPadUpCallback();
			});

			// D-Pad Down
			gamepad.on('hold', 'd_pad_down', function (e) {
				console.log(e.button + ' was pressed!');
				self.settings.onPressDPadDownCallback();
			});

			// D-Pad Left
			gamepad.on('hold', 'd_pad_left', function (e) {
				console.log(e.button + ' was pressed!');
				self.settings.onPressDPadLeftCallback();
			});

			// D-Pad Right
			gamepad.on('hold', 'd_pad_right', function (e) {
				console.log(e.button + ' was pressed!');
				self.settings.onPressDPadRightCallback();
			});

			// Start
			gamepad.on('press', 'start', function (e) {
				console.log(e.button + ' was pressed!');
				self.settings.onPressStartCallback();
			});

			// Select
			gamepad.on('press', 'select', function (e) {
				console.log(e.button + ' was pressed!');
				self.settings.onPressSelectCallback();
			});
		}
	}
	
//  Bind Window resize
window.onresize = function(event) {
    wall.updateSizeViewport();
};

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}