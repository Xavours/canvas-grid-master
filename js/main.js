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

//  Variable

//  Class Wall
	var canvas, ctx;
	
	//  Debug
	var lastOffsetX = 1;

    function Wall(id, idParent, array, params) {
	    var self = this;
	    this.id = id;
	    this.idParent = idParent;
	    this.source = array;
	    this.width = window.innerWidth;
	    this.height = window.innerHeight;
	    
	    //  Default settings
	    this.settings = {
		    tileWidth: 300,
		    tileHeight: 400,
		    content: 'rectangle',
		    fadeAnimation: 'easeOutCubic',
		    scaleOn: true,
		    scale: 1,
		    minScale: 0.05,
		    maxScale: 2
	    }
	    
	    //  Get new settings
	    params && validOptions(params)?$.extend( this.settings, params ):console.error('Some options are not valid');
	    
	    this.updateNumberTile = function () {
	            this.numberRow = Math.ceil(this.width / this.factorWidth) + 1,
	            this.numberCol = Math.ceil(this.height / this.factorHeight) + 1
	        }
	    
	    //  Handle the change of scale
	    this.scale = this.settings.scale;
	    this.updateScale = function () {
	        this.factorWidth = this.settings.tileWidth * this.scale;
	        this.factorHeight = this.settings.tileHeight * this.scale;
	    }
	    
	    //  Take care of the viewport = "what appears on the window"
	    this.viewport = {
	        minX: 0,
	        minY: 0,
	        maxX: self.width,
	        maxY: self.height
	    }
	    this.updateSizeViewport = function () {
	    	this.width = canvas.width = window.innerWidth;
			this.height = canvas.height = window.innerHeight;
			
	    }
	    
	    this.current = {
	        positionX: Math.floor(self.width / 2),
	        positionY: Math.floor(self.height / 2),
	        time: 0,
	        
	        //  Get the first tile on the upper left corner
	        getTile: function (x, y) {
	        
	        	var newX, newY;
	        	
	        	//  Considering the scale factor
	        	newX = Math.floor(x / self.factorWidth) + 1;
	            this.offsetX = self.factorWidth - ( x % self.factorWidth );
	            newY = Math.floor(y / self.factorHeight) + 1;
	            this.offsetY =  self.factorHeight - ( y % self.factorHeight );
	            
	            //  Considering the fact that my grid is limited
	            //  If a number is out of grid, the goal is to give him an id in the other side of the grid as it was a pattern
	        	if ( newX < 0 || newX >= 250 ) {
	        		( isEven( Math.floor( Math.abs(newX)/250) ) ) ? this.tileX = 250-Math.abs(newX) : this.tileX = Math.abs(newX)-250;
	        	} else {
		        	this.tileX = newX;
	        	}
	        	
	        	if ( newY < 0 || newY >= 250 ) {
	        		( isEven( Math.floor( Math.abs(newY)/250) ) ) ? this.tileY = 250-Math.abs(newY) : this.tileY = Math.abs(newY)-250;
	        	} else {
		        	this.tileY = newY;
	        	}
	        	
	        	//console.log(this.positionX + '  //  ' + this.positionY);
	        	console.log(newX + ' -> ' + isEven(Math.floor(newX/250)) + ' -> ' + this.tileX + '  //  ' + newY + ' -> ' + isEven(Math.floor(newY/250)) + ' -> ' + this.tileY);
	        }
	        
	        //  Get the right offset considering the scale   ???
	        
	    }
	    
	    //  Create the element "wall"
	    this.create = function () {
		    $('#' + idParent).html('<canvas id="' + self.id + '" width="' + self.width + '" height="' + self.height + '">');
		    canvas = document.getElementById( self.id )
			ctx = canvas.getContext("2d");
			
	    }
	    
	    //  Events method
	    this.getTileClicked = function (mouseX, mouseY) {
		    if ( mouseX < this.current.offsetX ) {
		        var x = 0;
	        } else {
		        var x = Math.floor(( mouseX - this.current.offsetX ) / this.factorWidth + 1);
	        }
	        if ( mouseY < this.current.offsetY ) {
		        var y = 0;
	        } else {
		        var y = Math.floor(( mouseY - this.current.offsetY ) / this.factorHeight + 1);
	        }
	        
	        //console.log(x + ' / ' + y);
	        return this.source[x, y]; 
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
	        if (this.settings.content == 'rectangle') this.drawRectangles();
	        
	    }
	    
	    this.drawRectangles = function () {
	    	for (var i = 0; i <self.numberRow; i++) {
	        	for (var j = 0; j <self.numberCol; j++) {
	        		
	        		var x = (this.current.tileX+i) % 250;
	        		var y = (this.current.tileY+j) % 250;
	        		var currentPoster = this.source[x][y];
	        		
	        		//  Get the color of the rectangle
	        		currentPoster.fade();
			        ctx.fillStyle = currentPoster.rgba;
			        
			        if ( i <1) {
				        
				        if ( j <1) {
				        					        	
					        ctx.fillRect(i*this.current.offsetX, j*this.current.offsetY, this.current.offsetX, this.current.offsetY);
					        
					        text(x, y, 20, 20);
					        
				        } else {
				        	
				        	ctx.fillRect(i*this.current.offsetX, this.current.offsetY + (j-1)*this.factorHeight, this.current.offsetX, this.factorHeight);
					        
					        text(x, y, i*this.current.offsetX +20, this.current.offsetY + (j-1)*this.factorHeight + 20);
						}
						
					} else {
						
						if ( j <1) {
					        ctx.fillRect(this.current.offsetX + (i-1)*this.factorWidth, j*this.current.offsetY, this.factorWidth, this.current.offsetY);
					        
					        text(x, y, this.current.offsetX + (i-1)*this.factorWidth + 20, j*this.current.offsetY + 20);
				        } else {
					        ctx.fillRect(this.current.offsetX + (i-1)*this.factorWidth, this.current.offsetY + (j-1)*this.factorHeight, this.factorWidth, this.factorHeight);
					        
					        text(x, y, this.current.offsetX + (i-1)*this.factorWidth + 20, this.current.offsetY + (j-1)*this.factorHeight + 20);
						}					
					}
				}
		    }
	    }
	    
	    this.drawImages = function () {
		    
	        for (var i = 0; i <self.numberRow; i++) {
	        	for (var j = 0; j <self.numberCol; j++) {
	        	
	        		var x = (this.current.tileX+i) % 250;
	        		var y = (this.current.tileY+j) % 250;
	        		var currentPoster = this.source[x][y];
	        		//console.log('donc : ' + x + '  //  ' + y);
	        		
	        		
	        		//  Get the source of images
	        		img = library[currentPoster.image.src];
	        		
	        		//  Get the alpha
	        		currentPoster.fade();
	        		ctx.globalAlpha = currentPoster.color.alpha;
			        
			        if ( i <1) {
				        
				        if ( j <1) {
				        	
				        	//  Debug
				        	/*
if (this.current.offsetX != lastOffsetX) {
				        		console.log('scale :' + this.scale + ' / offset :' + this.current.offsetX + ' / corrected offset :' + (this.current.offsetX/this.scale));
				        		lastOffsetX = this.current.offsetX;
				        	}
*/
				        		
					        ctx.drawImage(img, this.settings.tileWidth-(this.current.offsetX/this.scale), this.settings.tileHeight-(this.current.offsetY/this.scale), this.current.offsetX/this.scale, this.current.offsetY/this.scale, i*this.current.offsetX, j*this.current.offsetY, this.current.offsetX, this.current.offsetY);
				        } else {
					        
					        ctx.drawImage(img, this.settings.tileWidth-(this.current.offsetX/this.scale), 0, this.current.offsetX/this.scale, this.settings.tileHeight, i*this.current.offsetX, this.current.offsetY + (j-1)*this.factorHeight, this.current.offsetX, this.factorHeight);
						}
						
					} else {
						
						if ( j <1) {
					        ctx.drawImage(img, 0, this.settings.tileHeight-(this.current.offsetY/this.scale), this.settings.tileWidth, this.current.offsetY/this.scale, this.current.offsetX + (i-1)*this.factorWidth, j*this.current.offsetY, this.factorWidth, this.current.offsetY);
				        } else {
					        ctx.drawImage(img, 0, 0, this.settings.tileWidth, this.settings.tileHeight, this.current.offsetX + (i-1)*this.factorWidth, this.current.offsetY + (j-1)*this.factorHeight, this.factorWidth, this.factorHeight)
						}
					}
				}
		    } 
	    }
	}

//  Class Poster
	function Poster() {
		var self = this;
		this.color = {
		    red: randomPick(1, 255),
		    green: randomPick(1, 255),
		    blue: randomPick(1, 255),
		    alpha: 0
		};
		this.image = {
		    src: randomPick(0, library.length)
		};
		this.width = 50;
		this.height = 50;
		this.inViewport = false;
		this.blacked = true;
		this.factor = 1;
		this.time = 0;
		this.rgba;
		
		//  Determine what is the level of fade of the tile
		this.fade = function () {
			
			//  If the poster is not in the viewport
			if ( this.inViewport == false && this.blacked == true ) {
				this.rgba = "rgba(0, 0, 0, 1)";
				
				//  Get a chance to get the poster unblacked
				var chance = randomPick(1, 45 - this.factor);
				if ( chance == 1 ) {
					this.blacked = false;
					this.factor = 1;
				} else {
					this.factor++;
				}
				
				this.inViewport = true;
			
			//  If the poster is in the viewport but blacked
			} else if ( this.inViewport == true && this.blacked == true ) {
				
				//  Get a chance to get the poster unblacked
				var chance = randomPick(1, 45 - this.factor);
				if ( chance == 1 ) {
					this.blacked = false;
					this.factor = 1;
				} else {
					this.factor++;
				}
			
			//  If the poster is in the viewport and not blacked
			} else if ( this.inViewport == true && this.blacked == false ){
				if ( this.color.alpha < 1 ) {
	        		this.color.alpha = easeOutCubic(this.time, 0, 1, 600);
	        		this.time++;
	    		}
	    		this.rgba = "rgba(" + this.color.red + "," + this.color.green + "," + this.color.blue  + "," + this.color.alpha + ")";
	    	
	    	//  If other case throw error
			} else {
				console.error( "FADE PROBLEM" );
			}
			
		}
	}

//  Generate array
function generate(array) {
	for (var i = 0; i < 250; i++) {
		var col = [];
		for (var j = 0; j < 250; j++) {
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

//  Text
function text(indiceX, indiceY, x, y) {
	ctx.font="18px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(indiceX + ' / ' + indiceY, x, y);
}