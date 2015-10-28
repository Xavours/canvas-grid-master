// event handlers

	var el = document.getElementById('viewport');
	
	// create a simple instance
	// by default, it only adds horizontal recognizers
	var eventHandler = new Hammer(el);
	
	// let the pan gesture support all directions.
	// this will block the vertical scrolling on a touch-device while on the element
	eventHandler.get('pan').set({ direction: Hammer.DIRECTION_ALL });
	
	// listen to events...
	eventHandler.on("panleft panright panup pandown tap press", function(ev) {
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
		
	function OpenInNewTab(url) {
		var win = window.open(url, '_blank');
		win.focus();
	}
	
	//  Bind pan to scroll in any direction
	eventHandler.on("panleft panright panup pandown", function(e) {
        
        console.log(eventHandler.recognizers[3].pX + ' // ' + eventHandler.recognizers[3].pY);
        
        wall.current.positionX += -eventHandler.recognizers[3].pX;
        wall.current.positionY += -eventHandler.recognizers[3].pY;
	});
	
//  Bind Window resize

	window.onresize = function(event) {
	    wall.updateSizeViewport();
	};