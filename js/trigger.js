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
//   Bind Mouse control
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

	    wall.goScale(delta);
	}

	//  Mouse controls are binded only if in the settings 'controller' is set on 'mouse'
	if (wall.settings.controller == 'mouse') {

		//  Bind pan to scroll in any direction
		eventHandler.on("panstart", function(e) {
	        
	        lastX = e.center.x;
	        lastY = e.center.y;
	    
	    });
		
		eventHandler.on("panmove", function(e) {
	        
	        deltaX = lastX - e.center.x;
	        deltaY = lastY - e.center.y;
	        
	        wall.goTranslate(deltaX, deltaY);    
	        
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
	        
	        var target = wall.getTile(e.center.x, e.center.y)
	        wall.onClick(target);
	        
		});
		
		
		//  Bind hover
		el.addEventListener('mousemove', function(e) {
	        
	        var target = wall.getTile(e.pageX, e.pageY);
	        wall.onMouseover(target);
	        
		});
		
		
		//  Bind pinch
		eventHandler.on("pinchin", function(e) {

	        if (wall.settings.scaleOn) {
				if ( wall.scale >= wall.settings.minScale && wall.scale <= wall.settings.maxScale ) { 
			    	
			    	wall.scale -= ( e.scale * wall.factorWidth ) * pinchSensitivity;
		        
			    	if (wall.scale < wall.settings.minScale) {
			    		wall.scale = wall.settings.minScale;
			    	} else if (wall.scale > wall.settings.maxScale) {
			    		wall.scale = wall.settings.maxScale;
			    	} else {
				    	//  Correct position of view port to have the feeling that it zooms in the middle of the screen
						wall.current.positionX -= ( e.scale * wall.factorWidth ) * pinchSensitivity * wall.width / 2;
						wall.current.positionY -= ( e.scale * wall.factorWidth ) * pinchSensitivity * wall.height / 2;
			    	}
				}
			}
	        
		});
		
		eventHandler.on("pinchout", function(e) {
	        
			if (wall.settings.scaleOn) {
				if ( wall.scale >= wall.settings.minScale && wall.scale <= wall.settings.maxScale ) { 

					wall.scale += ( e.scale * wall.factorWidth ) * pinchSensitivity;

					if (wall.scale < wall.settings.minScale) {
						wall.scale = wall.settings.minScale;
					} else if (wall.scale > wall.settings.maxScale) {
						wall.scale = wall.settings.maxScale;
					} else {
				    	//  Correct position of view port to have the feeling that it zooms in the middle of the screen
				    	wall.current.positionX += ( e.scale * wall.factorWidth ) * pinchSensitivity * wall.width / 2;
				    	wall.current.positionY += ( e.scale * wall.factorWidth ) * pinchSensitivity * wall.height / 2;
				    }
				}
			}
	        
		});
	}	
	

/////////
//   Bind Keyboard control
/////////

	//  Keyboard controls are binded only if in the settings 'controller' is set on 'keyboard'
	if (wall.settings.controller == 'keyboard') {
		$(document).keydown(function (e) {
			switch (e.which) {
			
			    case 37:
			        // left
			        wall.goTranslate(-wall.settings.moveStep, 0);
			        break;
			
			    case 38:
			        // up
			        wall.goTranslate(0, wall.settings.moveStep);
			        break;
			
			    case 39:
			        // right
			        wall.goTranslate(wall.settings.moveStep, 0);
			        break;
			
			    case 40:
			        // down
			        wall.goTranslate(0, -wall.settings.moveStep);
			        break;

			    case 79:
			        // "o" -->>>  zoom in
			        wall.goScale(100);
			        break;

			    case 80:
			        // "p" -->>>  zoom out
			        wall.goScale(-100);
			        break;
			
			    default:
			        return; // exit this handler for other keys
			}
			e.preventDefault(); // prevent the default action (scroll / move caret)
		});
	}


/////////
//   Bind Gamepad control
/////////

	// Gamepad detection	
	var gamepad = new Gamepad();

	gamepad.on('connect', function (e) {
		console.log('controller ' + e.index + ' connected!');
	});

	gamepad.on('disconnect', function (e) {
		console.log('controller ' + e.index + ' disconnected!');
	});

	// Gamepad controls are binded only if in the settings 'controller' is set on 'gamepad'
	if (wall.settings.controller == 'gamepad') {

		// Cross
		gamepad.on('press', 'button_1', function () {
		    console.log('Button cross was pressed!');
		});

		// Circle
		gamepad.on('press', 'button_2', function () {
		    console.log('Button circle was pressed!');
		});

		// Square
		gamepad.on('press', 'button_3', function () {
		    console.log('Button square was pressed!');
		});

		// Triangle
		gamepad.on('press', 'button_4', function () {
		    console.log('Button triangle was pressed!');
		});

		// Analog left
		gamepad.on('hold', 'stick_axis_left', function (e) {
			//console.log(e.button + ' was pressed!');
			//  Update PositionX
	        wall.goTranslate(e.value[0]*5, e.value[1]*5);
		});

		// Analog right
		gamepad.on('hold', 'stick_axis_right', function (e) {
			//console.log(e.button + ' was pressed!');
			wall.goScale(-e.value[1]*10);
		});
	}
	
//  Bind Window resize

	window.onresize = function(event) {
	    wall.updateSizeViewport();
	};
	
//  Debug
	var myInterval = 0;
	
	/*
function debug(sec){
	
		window.setInterval(function(){
			if ( wall.scale >= wall.settings.minScale && wall.scale <= wall.settings.maxScale ) { 
			    	
			    	var current = wallContent[0][0];
			    					}
		}, sec);
		
	}
*/
