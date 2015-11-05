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
        
        //console.log('TRANSLATION :' + wall.current.positionX + '  //  ' + wall.current.positionY + '  //  ' + wall.width + '  //  ' + wall.height);
        
        wall.current.positionX += deltaX;
        wall.current.positionY += deltaY;
        
        console.log( 'TRANSLATION :' + wall.current.positionX + '  //  ' + wall.current.positionY );
        
        lastX = e.center.x;
        lastY = e.center.y;
	});
	
	//  Bind mousewheel to scale
	//  Work around because of Firefox / IE / opera
		function applyWheel(e){
		    var evt = window.event || e 									//equalize event object
		    var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta 		//check for detail first so Opera uses that instead of wheelDelta
		    
		    //  Do !
		    if (wall.settings.scaleOn) {
				if ( wall.scale >= wall.settings.minScale && wall.scale <= wall.settings.maxScale ) { 
			    	
			    	var lastScale = wall.scale;
			    	wall.scale += (delta/2000);
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
						
						console.log('ZOOM : positionX ' + wall.current.positionX + ' / correction : ' + (diffScale * (wall.current.positionX + wall.width / 2)) + ' / scale : ' + wall.scale);
						//console.log( 'ZOOM :' + wall.current.positionX + '  //  ' + wall.current.positionY );
						
						
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
	
	
	//  Bind pinch
	/*
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
*/
	
	
	//  Bind hover
	/*
el.addEventListener('mousemove', function(e) {
        
        var target = wall.getTile(e.pageX, e.pageY)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(e.pageX, e.pageY, 10, 10);
        
	});
*/
	
	
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
	
//  Debug
	var myInterval = 0;
	
	function debug(sec){
	
		window.setInterval(function(){
			zoom(0.05);
			wall.current.positionX += 0.05 * (wall.current.positionX + wall.width / 2);
			wall.current.positionY += 0.05 * (wall.current.positionY + wall.height / 2);
			console.log('ZOOM : positionX ' + wall.current.positionX + ' / correction : ' + (0.05 * (wall.current.positionX + wall.width / 2)) + ' / scale : ' + wall.scale);
		}, sec);
		
	}
	
	function zoom(delta) {
		wall.scale += delta;
	}