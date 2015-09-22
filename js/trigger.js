//  Mouse Controll
	//  Hovering/Mouseover/Collisiondetection
	//  Doesnt work now since the rects are moving when you scroll
	c.addEventListener("mousedown", function(e){
	    
	    flag = 0;
	    mousedown = true;
	    mouseup = false;
	    getMouseCoord(e);
	    
	}, false);
	
	c.addEventListener("mousemove", function(e){
	    
	    flag = 1;
	    if( mousedown && !mouseup ){
	    
	    	var lastmouseX = mouseX;
	        var lastmouseY = mouseY;
	        getMouseCoord(e);
	        var deltaX = mouseX - lastmouseX;
	        var deltaY = mouseY - lastmouseY;
	        
	        for (var i = rects.length - 1; i >= 0; i--) {
	        
				//  CornerPoints
				rectsClone[i].tlX += deltaX; 		//  Top left x
				rectsClone[i].tlY += deltaY; 		//  Top left y
			};
	    
	    }
	    console.log(mouseX + ' / ' + ctx.canvas.width);
	    
	    //  In case user goes out of the canvas with mousepressed
	    if ( mouseX < 20 || mouseY < 20 ||  mouseX > ctx.canvas.width - 20 || mouseY > ctx.canvas.height -20 ) {
		    mousedown = false;
			mouseup = true;
	    }
	    
	}, false);
	
	c.addEventListener("mouseup", function(e){
	    
	    mousedown = false;
	    mouseup = true;

	    if(flag === 0){
	    
	    	//  Click
	        console.log("click");
	        getImageId(mouseX, mouseY);
	        OpenInNewTab(rects[imageId].image);
	    }
	    else if(flag === 1){
	    
	    	//  Drag
	        console.log("drag done");
	        
	    }
	    
	}, false);


	//  Scroll functions
	var scrollFlag = false;
	$('.container').on('scroll' ,function(e){
			var scrollFlag = true;

			var x = ($('.container').scrollLeft() - 100) / dampener; 		//  Getting the amount of scroll
				x *= -1 ;													//  Invert it, else it will look like we scroll in the oposite direction
			var y = ($('.container').scrollTop() - 100) / dampener;
				y *= -1 ;													//  Invert it

			$('.container').scrollLeft(100);
			$('.container').scrollTop(100); 								// Preventing scroll, and stopping the overscroll in chrome and such.
			


			// We need to check the rects and restack them when needed. 
			// I mean, when the user scrolls the rects have to place themselves 
			// so that it looks like the grid just repeats itself

	
			//  zoomAdd([x, y]);
			//  $('.c').css({marginLeft:'+='+x+'px', marginTop: '+='+y+'px'}); //Keeping it just for reference

			//  Update position of the rect points

			for (var i = rects.length - 1; i >= 0; i--) {
				//  CornerPoints
				rectsClone[i].tlX += x; 		//  Top left x
				rectsClone[i].tlY += y; 		//  Top left y
			};


			

			//  Scroll stop timer kashizle, copied from somewhere
			clearTimeout($.data(this, 'scrollTimer'));
			$.data(this, 'scrollTimer', setTimeout(function() {
				// do something, anything!
				var scrollFlag = false;
				console.log("Haven't scrolled in 100ms!");


			}, 50));
			e.preventDefault();
			return false;
		
	});