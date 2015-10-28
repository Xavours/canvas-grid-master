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
	eventHandler.on("panleft panright panup pandown tap press pinch rotate", function(ev) {
	    console.log(ev.type +" gesture detected.");
	});

//  Bind Mouse control

	//  Mouse controller
		var flag = 0; 
		var mousedown = false;
		var mouseup = false;
		var rectHits = [];
		var mouseX, mouseY;
		var deltaX = 0;
		var deltaY = 0;
		var intervalCounter = 0;
		
	function OpenInNewTab(url) {
		var win = window.open(url, '_blank');
		win.focus();
	}
	
	//  Bind pan to scroll in any direction
	eventHandler.on("panstart panmove", function(e) {
        
        var lastX = wall.current.positionX;
        var lastY = wall.current.positionY;
        
        /*
var interval = window.setInterval(function() {
        
        	
        	wall.current.positionX = Math.floor(easeOutCubic(intervalCounter, lastX, -eventHandler.recognizers[3].pX, 6000));
        	wall.current.positionY = Math.floor(easeOutCubic(intervalCounter, lastY, -eventHandler.recognizers[3].pY, 6000));
        	console.log(wall.current.positionX + ' // ' + wall.current.positionY);
        	
        
	        if ( intervalCounter > 300 ) {
		        clearInterval(interval);
		        intervalCounter = 0;
	        }
	        
	        intervalCounter++;
        
        },20);
*/
        console.log(e);
        wall.current.positionX += -(e.deltaX);
        wall.current.positionY += -(e.deltaY);
	});
	
//  Bind Window resize

	window.onresize = function(event) {
	    wall.updateSizeViewport();
	};