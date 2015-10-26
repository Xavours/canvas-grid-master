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


//  Bind Mouse control

	//  Mouse controller
		var flag = 0; 
		var mousedown = false;
		var mouseup = false;
		var rectHits = [];
		var mouseX, mouseY;
		var deltaX = 0;
		var deltaY = 0;
		
		
	document.addEventListener("mousedown", function(e){
	    
	    flag = 0;
	    mousedown = true;
	    mouseup = false;
	    getMouseCoord(e);
	    console.log('down');
	    
	}, false);
	
	document.addEventListener("mousemove", function(e){
	    
	    flag = 1;
	    if( mousedown && !mouseup ){
	    
	    	var lastmouseX = mouseX;
	        var lastmouseY = mouseY;
	        getMouseCoord(e);
	        deltaX = mouseX - lastmouseX;
	        deltaY = mouseY - lastmouseY;
	        
	        wall.current.positionX += -deltaX;
	        wall.current.positionY += -deltaY;

			wall.render(posters);
	    
	    }
	    
	    //  In case user goes out of the canvas with mousepressed
	    if ( mouseX < 20 || mouseY < 20 ||  mouseX > ctx.canvas.width - 20 || mouseY > ctx.canvas.height -20 ) {
		    mousedown = false;
			mouseup = true;
	    }
	    
	}, false);
	
	document.addEventListener("mouseup", function(e){
	    
	    mousedown = false;
	    mouseup = true;

	    if(flag === 0){
	    
	    	//  Click
	        var target = wall.getTileClicked(mouseX, mouseY);
	        console.log(target);
	        OpenInNewTab(target.image.src);
	        
	    }
	    else if(flag === 1){
	    
	    	//  Drag
	        console.log("drag done");
	        
	    }
	    
	}, false);


function OpenInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}

function getMouseCoord(e) {
	mouseX = e.x;
	mouseY = e.y;
}