(function() {
	// requestAnimationFrame polyfill by Erik Möller
	// fixes from Paul Irish and Tino Zijdel
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
								   || window[vendors[x]+'CancelRequestAnimationFrame'];
	}
 
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
 
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

//  Clone function, damn I gotta remember them sources
	Object.prototype.clone = function() {
	  var newObj = (this instanceof Array) ? [] : {};
	  for (var i in this) {
	    if (i === 'clone') {continue;}
	    if (this[i] && typeof this[i] === "object") {
	      newObj[i] = this[i].clone();
	    } else {newObj[i] = this[i];}
	  } return newObj;
	};


//  Variable
	
	var library = [];				//  Hold the images
	var rects = []; 				//  Hold the rects
	var imageId;					//  Hold the id of the image object
	
	//  Mouse controller
		var flag = 0; 
		var mousedown = false;
		var mouseup = false;
		var rectHits = [];
		var mouseX, mouseY;
		
//  Class
	
	function Poster() {
		this.image = library[randomPick( 0, library.length - 1 )].src;
	}

window.onload = function(){

	//  Get library
	library = $('.library');
	console.log('We are ready!');

	//  Get some intel
	var dampener = 1;

	c = document.getElementById('c');
	ctx = c.getContext('2d');

	var windowWidth  = window.innerWidth;
	var windowHeight = window.innerHeight;
	ctx.canvas.width  = windowWidth;
	ctx.canvas.height = windowHeight;
	
	//  When window resize
	window.onresize = function(e) {
		windowWidth  = window.innerWidth;
		windowHeight = window.innerHeight;
		ctx.canvas.width  = windowWidth;
		ctx.canvas.height = windowHeight;
	}


	//  Rect - Defining the rectangle shit
		

		var rectSize = 300; //This sets both width and height
		var cols = 10;
		var rows = 10
		var nOfRects = cols*rows; //We get the number of rects

	//  Add rect nodes with X and Y according to the cols and rows
	for (var i = nOfRects - 1; i >= 0; i--) {
		rects[i] = new Poster();
		var x = (cols-i%cols)*rectSize - rectSize;
		var y = (rows-Math.floor(i/cols))*rectSize - rectSize;
		
		//  CornerPoints
		rects[i].tlX = x; //Top left x
		rects[i].tlY = y; //Top left y
	};

	var rectsClone = rects.clone();

	function draw(){
		
		//  Just clearing the screen
		ctx.clearRect(0, 0, windowWidth, windowHeight);

		//  Drawing images, I'm getting really good at this now
		for (var i = rects.length - 1; i >= 0; i--) {
			
			var img = new Image();
			img.src = rects[i].image;
			ctx.drawImage(img, rects[i].tlX, rects[i].tlY, rectSize, rectSize);
			
		};
	}

	//  yh, I wanted to seperate the update and draw, cause We wont just draw stuff, we will update other things as well
	function update() { 

		zoom();

		draw(); //Does all of that drawing

		restack();

		// if(scrollFlag){
		// 	rectSize = 100;
		// }

		//Need an easing function here:
		for (var i = rects.length - 1; i >= 0; i--) {
			//CornerPoints
			rects[i].tlX = easeCustom(1, rectsClone[i].tlX, rects[i].tlX, 60); //Top left x
			rects[i].tlY = easeCustom(1, rectsClone[i].tlY , rects[i].tlY, 60); //Top left y
		};

		requestAnimationFrame(update);
	}



	requestAnimationFrame(update);


//Mouse Controll
	// Hovering/Mouseover/Collisiondetection
	// Doesnt work now since the rects are moving when you scroll
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


function OpenInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}

function getMouseCoord(e) {
	mouseX = e.x;
	mouseY = e.y;
}


function getImageId(x, y) {
	
	//  Determine what col and row we are on
	 var colPos = x/rectSize; 
	 var rowPos = y/rectSize;
	 
	 //  Determine which side of teh rect we are on
	 var decY = colPos%1;
	 var decX = rowPos%1;
	 var sidePos = Math.ceil(decY + decX); 									//  Will be 1 on middle line
	 
	 //  Find the id of the rect we are on
	 imageId = (Math.floor(rowPos) * cols) + Math.ceil(colPos);
	 imageId = (cols * rows) - imageId;
	 console.log('Id: '+ imageId + ' / Side: ' + sidePos);

}

	//  Scroll functions
	var scrollFlag = false;
	
	$('.container').bind('mousewheel', function(e){
	
		var scrollFlag = true;
		console.log(e.originalEvent.wheelDelta);
		
		zoomAdd([1, e.originalEvent.wheelDelta]);

			//Update position of the rect points

			for (var i = rects.length - 1; i >= 0; i--) {
				//CornerPoints
				rectsClone[i].tlX; //Top left x
				rectsClone[i].tlY; //Top left y
			};
		
    });
	
// Zoom function
	var zoomSpeed = 0.01;
	var zoomBuffer = 0.00000001;
	var targetZoom = 0;
	var prevScale = 1;
	var currentScale = 1;
	
	function zoomAdd(zoomAmount){
		var amount = (Math.abs(zoomAmount[0]) + Math.abs(zoomAmount[1]))/2000;
		if(zoomBuffer < 0.06){
			//console.log('buffer:'+zoomBuffer);
			zoomBuffer += amount;
		}
	}
	function zoom () {
		var neg = 0;
		var pos = 0;
		if(zoomBuffer > 0 && currentScale > 0.6){
			neg = zoomBuffer/2;
			zoomBuffer -= neg;
			
		}
		if(currentScale < 1){
			pos = 0.02;
		}
		
		targetZoom += neg-pos;
		var scale = (targetZoom/5)*(currentScale*2); //Trying to ease some here
		prevScale = scale;
		currentScale = currentScale + pos - neg;
		targetZoom -= scale;
		ctx.scale((1-scale), (1-scale));
	}
	


// Restack function - it made sence when I was having a bunch of floating divs ok.
	//Setting the points where it should restack
	var restackPointL = -rectSize;
	var restackPointR = (rectSize * cols) - rectSize;
	var restackPointT = -rectSize;
	var restackPointB = rectSize * cols - rectSize - 2;

	function restack () {
		var outToCons = [];
		//  Lets loop through the rects and check their position
			for (var i = rects.length - 1; i >= 0; i--) {
				var x = rects[i].tlX;
				var y = rects[i].tlY;
				// Check x and y seperatly, and if they are less than -rectSize, we throw them over to the other side
				if(x < restackPointL){
					moveRectRight(i);
				} else if(x > restackPointR){
					moveRectLeft(i);
				}
				if(y < -rectSize){
					moveRectDown(i);
				} else if(y > restackPointB){
					moveRectUp(i);
				}
				//  If they are not, we gotta check if they are far off the positive way
				//  So if they are rectSize more than screensize, we throw them to the other side. 
				//  You can imagine there will be a lot of throwing around.

				//  outToCons[i] = {x: x, y: y}; //Remember, the rects are in reverse order
			};
		//  console.log(outToCons);
	}

	function moveRectRight(i){
		var offset = rectSize * cols;
		rects[i].tlX += offset; 			//  Top left x
		rectsClone[i].tlX += offset; 		//  Top left x
	}

	function moveRectLeft(i){
		var offset = rectSize * cols;
		rects[i].tlX -= offset;				//  Top left x
		rectsClone[i].tlX -= offset; 		//  Top left x
	}

	function moveRectDown(i){
		var offset = rectSize * cols;
		rects[i].tlY += offset; 			//  Top left Y
		rectsClone[i].tlY += offset; 		//  Top left Y
	}

	function moveRectUp(i){
		var offset = rectSize * cols;
		rects[i].tlY -= offset; 			//  Top left Y
		rectsClone[i].tlY -= offset; 		//  Top left Y
	}

};

//  Pick random number
function randomPick(min, max) {
    return Math.floor(Math.random() * max) + min;
}


