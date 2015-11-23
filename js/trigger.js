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

//  Bind Mouse control

	//  Initialize variable
		var lastX, lastY;
		var deltaX = 0;
		var deltaY = 0;
		var intervalCounter = 0;
		var startWheel, lastWheel, diffWheel;
		startWheel = lastWheel = new Date();
		
	function OpenInNewTab(url) {
		var win = window.open(url, '_blank');
		win.focus();
	}
	
	//  Bind pan to scroll in any direction
	eventHandler.on("panstart", function(e) {
        
        lastX = e.center.x;
        lastY = e.center.y;
    
    });
	
	eventHandler.on("panmove", function(e) {
        
        deltaX = lastX - e.center.x;
        deltaY = lastY - e.center.y;
        
        //  Update PositionX, Y
        wall.current.positionX += deltaX;
        wall.current.positionY += deltaY;
        
        //  Update ViewportX, Y
        wall.current.viewportX += deltaX / wall.scale;
		wall.current.viewportY += deltaY / wall.scale;    
        
        lastX = e.center.x;
        lastY = e.center.y;
        
	});
	
	eventHandler.on("panend", function(e) {
        
        //  When you finish paning, update viewportX, Y
        //  Wait 0.5 sec to update it though cause the movement might not be finished when you stop paning                 
        
	});
	
	//  Bind mousewheel to scale
	//  Work around because of Firefox / IE / opera
		function applyWheel(e){
		    var evt = window.event || e 									//equalize event object
		    var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta 		//check for detail first so Opera uses that instead of wheelDelta
		    
		    // Zoom if the option scaleOn is true
		    if (wall.settings.scaleOn) {
		    
		    	//  If you start wheeling the mouse stock for the first time since 3 seconds, update viewportX, Y
		    	startWheel = new Date();
		    	diffWheel = (startWheel- lastWheel) / 1000;
		    			    
				//Update Scale
				if ( wall.scale >= wall.settings.minScale && wall.scale <= wall.settings.maxScale ) { 
			    	
			    	var lastScale = wall.scale;
			    	wall.scale += (delta/2000);
			    	var diffScale = wall.scale - lastScale;
		        
			    	if (wall.scale < wall.settings.minScale) {
			    		wall.scale = wall.settings.minScale;
			    	} else if (wall.scale > wall.settings.maxScale) {
			    		wall.scale = wall.settings.maxScale;
			    	} else {
			    			    		
				    	//  Correct position of viewport to have the feeling that it zooms in the center of the screen
				    		
				    		//  Warning : diffScale can be bigger than (maxScale - lastScale) or (lastScale - minScale)
				    		if ( diffScale > (wall.settings.maxScale - lastScale) ) diffscale = wall.settings.maxScale - lastScale;
				    		if ( diffScale > (lastScale - wall.settings.minScale) ) diffscale = lastScale - wall.settings.minScale;
				    		
						var correctionX = diffScale * (wall.current.viewportX + wall.width / 2);
						var correctionY = diffScale * (wall.current.viewportY + wall.height / 2);
						
						wall.current.positionX += correctionX;
						wall.current.positionY += correctionY;
						
						//wall.current.identifyTile(wall.current.viewportX, wall.current.viewportY);
						console.log(wall.scale + '  /  ' + correctionX + '  /  ' + correctionY);
			    	}
				}
			}
		}
		
		//  FF doesn't recognize mousewheel as of FF3.x
		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" 
		 
		//  if IE (and Opera depending on user setting)
		el.addEventListener('mouseover', function() {
			if (document.attachEvent)
			    document.attachEvent("on"+mousewheelevt, applyWheel)
			
			//  WC3 browsers
			else if (document.addEventListener)
			    document.addEventListener(mousewheelevt, applyWheel, false);
		});
	    	
	//  Bind click
	eventHandler.on("tap", function(e) {
        
        var target = wall.getTile(e.center.x, e.center.y)
        //console.log('alpha : ' + target.color.alpha + '  /  alphaEnd : ' + target.alphaEnd);
        wall.onClick(target);
        
	});
	
	
	//  Bind hover
	el.addEventListener('mousemove', function(e) {
        
        var target = wall.getTile(e.pageX, e.pageY);
        wall.onMouseover(target);
        
	});
	
	
	//  Bind pinch
	var pinchSensitivity = 6 / 100000;
	
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
	
//  Bind keys
	$(document).keydown(function (e) {
		switch (e.which) {
		
		    case 37:
		        // left

		        break;
		
		    case 38:
		        // up
		        break;
		
		    case 39:
		        // right
		        break;
		
		    case 40:
		        // down
		        break;
		
		    default:
		        return; // exit this handler for other keys
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	});
	
//  Bind Window resize

	window.onresize = function(event) {
	    wall.updateSizeViewport();
	};
	
//  Debug
	var myInterval = 0;
	
	function debug(sec){
	
		window.setInterval(function(){
			if ( wall.scale >= wall.settings.minScale && wall.scale <= wall.settings.maxScale ) { 
			    	
			    	var current = wallContent[0][0];
			    	console.log( 'alphaEnd : ' + current.aplhaEnd + ' / rgba : ' + current.rgba + ' / time : ' + current.time );
			    	
			    	/*
var lastScale = wall.scale;
			    	wall.scale += 0.05;
			    	var diffScale = wall.scale - lastScale;
		        
			    	if (wall.scale < wall.settings.minScale) {
			    		wall.scale = wall.settings.minScale;
			    	} else if (wall.scale > wall.settings.maxScale) {
			    		wall.scale = wall.settings.maxScale;
			    	} else {
			    	
			    		//console.log('ZOOM :' + wall.current.positionX + '  //  ' + wall.current.positionY + '  //  ' + wall.width + '  //  ' + wall.height);
			    		
				    	//  Correct position of viewport to have the feeling that it zooms in the center of the screen
						wall.current.positionX += diffScale * (wall.current.positionX + wall.width / 2);
						wall.current.positionY += diffScale * (wall.current.positionY + wall.height / 2);
						
						console.log('ZOOM : pX ' + wall.current.positionX + ' / diff : ' + diffScale + ' / corr : ' + (diffScale * (wall.current.positionX + wall.width / 2)) + ' / scale : ' + wall.scale);
						//console.log( 'ZOOM :' + wall.current.positionX + '  //  ' + wall.current.positionY );

						
						
			    	}*/
				}
		}, sec);
		
	}