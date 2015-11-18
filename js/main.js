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

//  Class Wall
	var canvas, ctx;
	var lastTileHovered = {};
	
	//  Debug
	var lastOffsetX = 1;
	var lastPositionX = 1;

    function Wall(id, idParent, array, params) {
	    var self = this;
	    this.id = id;
	    this.idParent = idParent;
	    this.source = array;
	    this.width = window.innerWidth;
	    this.height = window.innerHeight;
	    
	    //  Default settings
	    this.settings = {
	    
	    	// Main options
		    tileWidth: 300,
		    tileHeight: 400,
		    content: 'rectangle',
		    fadeAnimation: 'easeOutCubic',
		    
		    // Scale options
		    scaleOn: true,
		    scale: 1,
		    minScale: 0.25,
		    maxScale: 1.75,
		    scaleSensitivity: 1,
		    
		    // Spread options
		    spreadMode: 'random',
		    numberTile: 100,
		    
		    //  Render Options
		    startX: 0, //  TBD
		    starY: 0, //  TBD
		    
		    //  Event Options
			onClickCallback: function() {console.log('click')},
			mouseoverCallback: function() {}
	    }
	    this.numberTile = this.settings.numberTile;
	    
	    //  Get new settings
	    params && validOptions(params)?$.extend( this.settings, params ):console.error('Some options are not valid');
	    
	    this.updateNumberTile = function () {
	            this.numberRow = Math.ceil(this.width / this.factorWidth) + 1,
	            this.numberCol = Math.ceil(this.height / this.factorHeight) + 1
	        }
	    
	    //  Calculate FPS to change animation time according to FPS
	    this.FPS = 60;
	    this.updateFPS = function () {
	        this.FPS = fps.getFPS();
	    }
	    
	    //  Handle the change of scale
	    this.scale = this.settings.scale;
	    this.updateScale = function () {
	        this.factorWidth = this.settings.tileWidth * this.scale;
	        this.factorHeight = this.settings.tileHeight * this.scale;
	        
	        //  virtualWidth and virtualHeight represent the quantity of pixels that fits on the wall considering the scale.
	        //  For example if the wall has a width of 100px and the scale is 1.5, this 100px represent 150px. It is stored in the current object.
	        this.current.virtualWidth = this.width / this.scale;
	        this.current.virtualHeight = this.height / this.scale;
	    }
	    
	    //  Take care of the viewport = "what appears on the window"
	    this.updateSizeViewport = function () {
	    	this.width = canvas.width = window.innerWidth;
			this.height = canvas.height = window.innerHeight;
			
	    }
		
		this.newX = function(x){
				return Math.floor(x / self.factorWidth);
		}
		
		this.newY = function(y){
				return Math.floor(y / self.factorHeight);
		}
	    
	    this.current = {
	        positionX: 0,
	        positionY: 0,
	        
	        //  positionX, Y updates when translating and zooming the wall
	        //  viewportX, Y updates only when translating. While zooming we use viewportX, Y
	        viewportX: 0, //self.width / 2,
	        viewportY: 0, //self.height / 2,
	        time: 0,
			
	        identifyTile: function (x, y) {
				
	        	//  Considering the scale factor
	        	var newX = self.newX(x), 
					newY = self.newY(y), 
					finalX = newX, 
					finalY = newY;
	            
	            //  Considering the fact that my grid is limited
	            //  If a number is out of grid, the goal is to give him an id in the other side of the grid as it was a pattern
	        	if ( newX < 0 || newX >= self.numberTile ) {
					var absX = Math.abs(newX);
	        		finalX = ( isEven( Math.floor( absX/self.numberTile) ) ) ? self.numberTile-absX : absX-self.numberTile;
	        	}
	        	
	        	if ( newY < 0 || newY >= self.numberTile ) {
					var absY = Math.abs(newY);
	        		finalY = ( isEven( Math.floor( absY/self.numberTile) ) ) ? self.numberTile-absY : absY-self.numberTile;
	        	}
	        	
	        	//console.log( finalX + ' / ' + finalY );

				//return this.source[ (this.current.tileX + newX) % self.numberTile ][ (this.current.tileY + newY) % self.numberTile ]; 

	        	
	        },
	        
	        //  Get the first tile on the upper left corner
	        getTile: function (x, y) {
	        	
	        	//  Considering the scale factor
	        	var newX = self.newX(x), 
					newY = self.newY(y);
	        	
	        	//  2 cases : if position is negative or positive
	        	if (x >= 0) {
		            this.offsetX = self.factorWidth - ( x % self.factorWidth );
		        } else {
			        this.offsetX = Math.abs(x) % self.factorWidth;
		        }
	            if (y >= 0) {
		            this.offsetY =  self.factorHeight - ( y % self.factorHeight );
		        } else {
			        this.offsetY =  Math.abs(y) % self.factorHeight;
		        }
	            
	            //  Considering the fact that my grid is limited
	            //  If a number is out of grid, the goal is to give him an id in the other side of the grid as it was a pattern
	            if ( newX < 0 || newX >= self.numberTile ) {
					var absX = Math.abs(newX);
	        		this.tileX = ( isEven( Math.floor( absX/self.numberTile) ) ) ? self.numberTile-absX : absX-self.numberTile;
	        	} else {
		        	this.tileX = newX;
	        	}
	        	
	        	if ( newY < 0 || newY >= self.numberTile ) {
					var absY = Math.abs(newY);
	        		this.tileY = ( isEven( Math.floor( absY/self.numberTile) ) ) ? self.numberTile-absY : absY-self.numberTile;
	        	} else {
		        	this.tileY = newY;
	        	}
	        }
	      	        
	    }
	    
	    //  Create or destroy the element "wall"
	    this.create = function () {
		    $('#' + idParent).html('<canvas id="' + self.id + '" width="' + self.width + '" height="' + self.height + '">');
		    canvas = document.getElementById( self.id );
			ctx = canvas.getContext("2d");
	    }
	    
	    //  Events method to get Tile with coord (for example mouse)
	    this.getTile = function (x, y) {
			var tempX = x - this.current.offsetX,
				tempY = y - this.current.offsetY,
				newX = 0,
				newY = 0;
			
		    if (tempX >= 0) {
		        newX = Math.floor( tempX / this.factorWidth + 1 );
	        }
	        if (tempY >= 0) {
		        newY = Math.floor( tempY / this.factorWidth + 1 );
	        }
			
			//console.log('x : ' + (this.current.tileX + newX) % self.numberTile + '  /  y : ' + (this.current.tileY + newY) % self.numberTile);
			return this.source[ (this.current.tileX + newX) % self.numberTile ][ (this.current.tileY + newY) % self.numberTile ];
	    }

	    this.onClick = function () {	    
		    this.settings.onClickCallback();
	    }
	    
	    this.onMouseover = function (tile) {
	    	
	    	if ( typeof lastTileHovered.color == 'undefined' ) {
			    
			    self.current.tileHoveredAlpha = 1;
			    
			    tile.startTime = Date.now();
			    tile.alphaEnd = 0.3;
			    tile.calculAlpha(tile.alpha, 300);
			    
			    tile.hovered = true;
			    lastTileHovered = tile;
			    
		    } else if ( tile.hovered !== lastTileHovered.hovered ) {
		    	
		    	// Restore the alpha of the last tile hovered
		    	lastTileHovered.startTime = Date.now();
			    lastTileHovered.alphaEnd = self.current.tileHoveredAlpha;
			    lastTileHovered.calculAlpha(lastTileHovered.alpha, 300);
			    lastTileHovered.hovered = false;
		    	
		    	//  Store the actual alpha of the new tile hovered before to change it
		    	self.current.tileHoveredAlpha = tile.color.alpha;
		    	
		    	//  Hover the new tile
		    	tile.startTime = Date.now();
			    tile.alphaEnd = 0.3;
			    tile.calculAlpha(tile.alpha, 300);
			    tile.hovered = true;
			    
			    //  Update last tile hovered
			    lastTileHovered = tile;
				
			    
			    
			    
		    }
		    
		    this.settings.mouseoverCallback();  
	    }
	    
	    //  Rendering methods
	    this.render = function () {
	    
	    	//  Update Data
	        this.updateScale();
	        this.updateNumberTile();
	        this.current.getTile(this.current.positionX, this.current.positionY)
	        
	        //  Clear canvas
	        ctx.clearRect(0, 0, self.width, self.height);
	        
	        //  Chosse rendering mode
	        if (this.settings.content == 'image') this.drawImages();
	        else if (this.settings.content == 'rectangle') this.drawRectangles();
	        
	    }
	    
	    this.drawRectangles = function () {
	    	for (var i = 0; i < self.numberRow; i++) {
	        	for (var j = 0; j < self.numberCol; j++) {
	        		
	        		var x = (this.current.tileX+i) % self.numberTile;
	        		var y = (this.current.tileY+j) % self.numberTile;
	        		var currentPoster = this.source[x][y];
	        		//  Get the color of the rectangle
	        		currentPoster.fade();
			        ctx.fillStyle = currentPoster.rgba;
					
					// Optimisations
					var jTimesOffY = j*this.current.offsetY;
					var factorOffsetLoopX = self.factorOffsetLoopX(i);
					var factorOffsetLoopY = self.factorOffsetLoopY(j);
					
					
 					if ( i <1) {
						var iTimeOffX = i*this.current.offsetX;
				        
				        if ( j <1) {		        	
					        ctx.fillRect(iTimeOffX, jTimesOffY, this.current.offsetX, this.current.offsetY);
					        
					        text(x, y, 20, 20);
					        
				        } else {
				        	ctx.fillRect(iTimeOffX, factorOffsetLoopY, this.current.offsetX, this.factorHeight);
					        
					        text(x, y, iTimeOffX + 20, factorOffsetLoopY + 20);
						}
						
					} else {
						
						if ( j <1) {
					        ctx.fillRect(factorOffsetLoopX, jTimesOffY, this.factorWidth, this.current.offsetY);
					        
					        text(x, y, factorOffsetLoopX + 20, jTimesOffY + 20);
				        } else {
					        ctx.fillRect(factorOffsetLoopX, factorOffsetLoopY, this.factorWidth, this.factorHeight);
					        
					        text(x, y, factorOffsetLoopX + 20, factorOffsetLoopY + 20);
						}					
					}
				}
		    }
	    }
	    
	    this.drawImages = function () {
		    
	        for (var i = 0; i <self.numberRow; i++) {
	        	for (var j = 0; j <self.numberCol; j++) {
	        	
	        		var x = (this.current.tileX+i) % self.numberTile;
	        		var y = (this.current.tileY+j) % self.numberTile;
	        		
	        		//console.log(this.source);
	        		var currentPoster = this.source[x][y];
	        		
	        		
	        		//  Get the source of images
	        		var img = new Image();
	        		
	        		//console.log(currentPoster.imgSrc);
	        		img.src = currentPoster.imgSrc;
	        		
	        		//  Get the alpha
	        		currentPoster.fade();
	        		ctx.globalAlpha = currentPoster.color.alpha;
					
					
					if ( j < 1 ) {
						var scaleDivideOffY = this.current.offsetY/this.scale
						var tileHeightMinusOff = this.settings.tileHeight - scaleDivideOffY;
					}
					
			        if ( i < 1 ) {
				        var scaleDivideOffX = this.current.offsetX/this.scale;
						var tileWidthMinusOff = this.settings.tileWidth - scaleDivideOffX;
				        if ( j < 1 ) {        		
					        ctx.drawImage(img, 
							tileWidthMinusOff, 
							tileHeightMinusOff, 
							scaleDivideOffX, 
							scaleDivideOffY, 
							i*this.current.offsetX, 
							j*this.current.offsetY, 
							this.current.offsetX, 
							this.current.offsetY);
				        } else {
					        
					        ctx.drawImage(img, 
							tileWidthMinusOff, 
							0, 
							scaleDivideOffX, 
							this.settings.tileHeight, 
							i*this.current.offsetX, 
							this.factorOffsetLoopY(j), 
							this.current.offsetX, 
							this.factorHeight);
						}
						
					} else {
						
						if ( j < 1 ) {
					        ctx.drawImage(img, 0, 
							tileHeightMinusOff, 
							this.settings.tileWidth, 
							scaleDivideOffY, 
							this.factorOffsetLoopX(i), 
							j*this.current.offsetY, 
							this.factorWidth, 
							this.current.offsetY);
				        } else {
					        ctx.drawImage(img, 0, 0, 
							this.settings.tileWidth, 
							this.settings.tileHeight, 
							this.factorOffsetLoopX(i), 
							this.factorOffsetLoopY(j), 
							this.factorWidth, 
							this.factorHeight)
						}
					}
				}
		    } 
	    }
		
		this.factorOffsetLoopX = function(i){
			return this.current.offsetX + (i-1)*this.factorWidth;
		}
		
		this.factorOffsetLoopY = function(j){
			return this.current.offsetY + (j-1)*this.factorHeight;
		}
	}

//  Class Poster
var shuffleCounter = 0;

function Poster() {
	var self = this;
	
	this.color = {
	    red: randomPick(1, 255),
	    green: randomPick(1, 255),
	    blue: randomPick(1, 255),
	    alpha: 0,
		rgba: function(){
			var c = self.color;
			return [c.red, c.green, c.blue, c.alpha].join(",");
		}
	};
	
	//  Apply Spread Mode
	if (wall.settings.spreadMode == 'random') {
	    this.imgSrc = library[randomPick(0, library.length)].src;
	} else if (wall.settings.spreadMode == 'shuffle') {
		if (shuffleCounter < library.length) {
	    	this.imgSrc = library[shuffleCounter].src;
	    	
	    	//  Custom for flyposter.ca
	    	/* this.index = parseInt(library[shuffleCounter].id); */
	    } else {
	    	shuffle(library);
	    	shuffleCounter = 0;
	    	
	    	//  Custom for flyposter.ca
	    	/* this.index = parseInt(library[shuffleCounter].id); */
	    }
		
		this.imgSrc = library[shuffleCounter].src;
		shuffleCounter++;
	//console.log(shuffleCounter);
	};
	
	this.width = 50;
	this.height = 50;
	this.inViewport_bl = false;
	this.blacked_bl = true;
	this.factor = 1;
	this.alphaEnd = 1;					//  If the poster is being hovered, alphaEnd = 0.5;
	this.rgba;
	this.hovered = false;
	
	//  Determine what is the level of fade of the tile
	this.calculAlpha = function (alphaStart, time) {
		this.time = Date.now();
	    this.currentTime = this.time - this.startTime;
	    this.color.alpha = easeOutCubic(this.currentTime, alphaStart, this.alphaEnd, time);
	    
	    //  If time is over, give it the alphaEnd
	    if (this.currentTime > 1000) this.color.alpha = this.alphaEnd;
	}
	
	this.fade = function () {
		
		//  If the poster is not in the viewport
		if ( this.inViewport_bl == false && this.blacked_bl == true ) {
			
			//  Get a chance to get the poster unblacked
			var chance = randomPick(1, 45 - this.factor);
			if ( chance == 1 ) {
				this.blacked_bl = false;
				this.factor = 1;
			} else {
				this.factor++;
			}
			
			this.inViewport_bl = true;
		
		//  If the poster is in the viewport but blacked
		} else if ( this.inViewport_bl == true && this.blacked_bl == true ) {
			
			//  Get a chance to get the poster unblacked
			var chance = randomPick(1, 45 - this.factor);
			if ( chance == 1 ) {
				this.blacked_bl = false;
				this.factor = 1;
				this.startTime = Date.now();
			} else {
				this.factor++;
			}
		
		//  If the poster is in the viewport and not blacked
		} else if ( this.inViewport_bl == true && this.blacked_bl == false ){
			if ( this.color.alpha < 1 ) {
				
				this.calculAlpha(0, 1000);
			    
				this.rgba = "rgba(" + this.color.rgba() + ")";
    		}
			
    		
    	
    	//  If other case throw error
		} else {
			console.error( "FADE PROBLEM" );
		}
		
	}
}

//  Generate array
function generate(array) {

	shuffle(library);
	for (var i = 0; i < wall.numberTile; i++) {
		var col = [];
		for (var j = 0; j < wall.numberTile; j++) {
		    var poster = new Poster;
		    col.push(poster);
		}
		array.push(col);
	}
}

//  Pick random number
function randomPick(min, max) {
	return Math.floor(Math.random() * max) + min;
}

//  Return true if even number
function isEven(n) {
  return n == parseFloat(n) && !(n % 2);
}

//  Text for debugging
function text(indiceX, indiceY, x, y) {
	ctx.font="18px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(indiceX + ' / ' + indiceY, x, y);
}

// Shuffle
function shuffle(o) {
	for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

//  Calculate FPS
var fps = {
	startTime : 0,
	frameNumber : 0,
	getFPS : function(){
		this.frameNumber++;
		var d = new Date().getTime(),
			currentTime = ( d - this.startTime ) / 1000,
			result = Math.floor( ( this.frameNumber / currentTime ) );

		if( currentTime > 1 ){
			this.startTime = new Date().getTime();
			this.frameNumber = 0;
		}
		return result;

	}
};
