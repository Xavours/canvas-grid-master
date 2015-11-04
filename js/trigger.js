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
		
	function OpenInNewTab(url) {
		var win = window.open(url, '_blank');
		win.focus();
	}
	
	//  Bind pan to scroll in any direction
	eventHandler.on("panstart", function(e) {
        
        lastX = e.center.x;
        lastY = e.center.y;
        //console.log(lastX + ' // ' + lastY);
    
    });
	
	eventHandler.on("panmove", function(e) {
        
        wall.updateFPS();
        
        deltaX = lastX - e.center.x;
        deltaY = lastY - e.center.y;
        //console.log('move');
        
        wall.current.positionX += deltaX;
        wall.current.positionY += deltaY;
        lastX = e.center.x;
        lastY = e.center.y;
	});
	
	//  Bind mousewheel to scale
	//  Work around because of Firefox / IE / opera
		function applyWheel(e){
		    var evt = window.event || e 									//equalize event object
		    var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta 	//check for detail first so Opera uses that instead of wheelDelta
		    
		    //  Do !
		    if (wall.settings.scaleOn) {
				if ( wall.scale >= wall.settings.minScale && wall.scale <= wall.settings.maxScale ) { 
			    	
			    	wall.scale += (delta/2000);
		        
			    	if (wall.scale < wall.settings.minScale) {
			    		wall.scale = wall.settings.minScale;
			    	} else if (wall.scale > wall.settings.maxScale) {
			    		wall.scale = wall.settings.maxScale;
			    	} else {
				    	//  Correct position of view port to have the feeling that it zooms in the middle of the screen
						wall.current.positionX += (delta/2000) * wall.width / 2;
						wall.current.positionY += (delta/2000) * wall.height / 2;
			    	}
				}
			}
		}
		
		//  FF doesn't recognize mousewheel as of FF3.x
		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" 
		 
		//  if IE (and Opera depending on user setting)
		if (document.attachEvent)
		    document.attachEvent("on"+mousewheelevt, applyWheel)
		
		//  WC3 browsers
		else if (document.addEventListener)
		    document.addEventListener(mousewheelevt, applyWheel, false);
	    	
	//  Bind click
	eventHandler.on("tap", function(e) {
        
        var target = wall.getTile(e.center.x, e.center.y)
        OpenInNewTab(target.imgSrc);
        
	});
	
	//  Bind hover
	el.addEventListener('mousemove', function(e) {
        
        var target = wall.getTile(e.pageX, e.pageY)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(e.pageX, e.pageY, 10, 10);
        
	});
	
	
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