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

	//  Mouse controller
		var lastX, lastY;
		var deltaX = 0;
		var deltaY = 0;
		var intervalCounter = 0;
		var wheelDelta = 0;
		
	function OpenInNewTab(url) {
		var win = window.open(url, '_blank');
		win.focus();
	}
	
	//  Bind pan to scroll in any direction
	eventHandler.on("panstart", function(e) {
        
        lastX = e.center.x;
        lastY = e.center.y;
        console.log(lastX + ' // ' + lastY);
    
    });
	
	eventHandler.on("panmove", function(e) {
        
        deltaX = lastX - e.center.x;
        deltaY = lastY - e.center.y;
        //console.log('move');
        
        wall.current.positionX += deltaX;
        wall.current.positionY += deltaY;
        lastX = e.center.x;
        lastY = e.center.y;
	});
	
	//  Bind mousewheel to scale
	el.addEventListener('mousewheel', function(e) {
		
		if (wall.settings.scaleOn) {
			if ( wall.scale >= wall.settings.minScale && wall.scale <= wall.settings.maxScale ) { 
		    	wall.scale += (e.wheelDelta/2000);
		    	if (wall.scale < wall.settings.minScale) wall.scale = wall.settings.minScale;
		    	if (wall.scale > wall.settings.maxScale) wall.scale = wall.settings.maxScale;
			}
		}
		    
	}, false);
	
	
//  Bind keys
	$(document).keydown(function (e) {
		switch (e.which) {
		
		    case 37:
		        // left

		        break;
		
		    case 38:
		        // up
		        wall.scale += 0.05;
				wall.render();
		        break;
		
		    case 39:
		        // right
		        break;
		
		    case 40:
		        // down
		        wall.scale -= 0.05;
				wall.render();
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