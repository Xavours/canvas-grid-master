//  Class Wall
	var canvas, ctx;

    function Wall(id, idParent, array, params) {
	    var self = this;
	    this.id = id;
	    this.idParent = idParent;
	    this.source = array;
	    this.width = $(window).width();
	    this.height = $(window).height();
	    
	    //  Default settings
	    this.settings = {
		    tileWidth: 300,
		    tileHeight: 400,
		    content: 'image',
		    fadeAnimation: 'easeOutCubic'
	    }
	    
	    //  Get new settings
	    params && validOption(params)?$.extend( this.settings, params ):console.error('problem');
	    
	    this.updateNumberTile = function () {
	            this.numberRow = Math.ceil(this.width / this.factorWidth) + 1,
	            this.numberCol = Math.ceil(this.height / this.factorHeight) + 1
	        }
	    
	    //  Handle the change of scale
	    this.scale = 1;
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
	    this.updateViewport = function () {
	        this.factorWidth = this.settings.tileWidth * this.scale;
	        this.factorHeight = this.settings.tileHeight * this.scale;
	    }
	    
	    this.current = {
	        positionX: Math.floor(self.width / 2),
	        positionY: Math.floor(self.height / 2),
	        
	        //  Get the first tile on the upper left corner
	        getTile: function (x, y) {
	            this.tileX = Math.floor(x / self.factorWidth) + 1;
	            this.offsetX = self.factorWidth - ( x % self.factorWidth );
	            this.tileY = Math.floor(y / self.factorHeight) + 1;
	            this.offsetY =  self.factorHeight - ( y % self.factorHeight );
	        }
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
		        var tileX = 0;
	        } else {
		        var tileX = Math.floor(( mouseX - this.current.offsetX ) / this.factorWidth + 1);
	        }
	        if ( mouseY < this.current.offsetY ) {
		        var tileY = 0;
	        } else {
		        var tileY = Math.floor(( mouseY - this.current.offsetY ) / this.factorHeight + 1);
	        }
	        
	        console.log(tileX + ' / ' + tileY);
	        return this.source[tileX, tileY]; 
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
	        	
	        		var currentPoster = this.source[this.current.tileX + i][this.current.tileY + j];
	        		
	        		//  Get the color of the rectangle
	        		currentPoster.fade();
			        ctx.fillStyle = currentPoster.rgba;
			        
			        if ( i <1) {
				        
				        if ( j <1) {
					        ctx.fillRect(i*this.current.offsetX, j*this.current.offsetY, this.current.offsetX, this.current.offsetY);
				        } else {
					        ctx.fillRect(i*this.current.offsetX, this.current.offsetY + (j-1)*self.factorHeight, this.current.offsetX, self.factorHeight);
						}
						
					} else {
						
						if ( j <1) {
					        ctx.fillRect(this.current.offsetX + (i-1)*self.factorWidth, j*this.current.offsetY, self.factorWidth, this.current.offsetY);
				        } else {
					        ctx.fillRect(this.current.offsetX + (i-1)*self.factorWidth, this.current.offsetY + (j-1)*self.factorHeight, self.factorWidth, self.factorHeight)
						}
					}
				}
		    }
	    }
	    
	    this.drawImages = function () {
		    
		    var proportion = 1;
	        for (var i = 0; i <self.numberRow; i++) {
	        	for (var j = 0; j <self.numberCol; j++) {
	        	
	        		var currentPoster = this.source[this.current.tileX + i][this.current.tileY + j];
	        		
	        		//  Get the source of images
	        		img = library[currentPoster.image.src];
	        		
	        		//  Get the alpha
	        		currentPoster.fade();
	        		ctx.globalAlpha = currentPoster.color.alpha;
			        
			        if ( i <1) {
				        
				        if ( j <1) {
					        ctx.drawImage(img, this.settings.tileWidth-this.current.offsetX, this.settings.tileHeight-this.current.offsetY, this.current.offsetX, this.current.offsetY, i*this.current.offsetX, j*this.current.offsetY, this.current.offsetX, this.current.offsetY);
				        } else {
					        ctx.drawImage(img, this.settings.tileWidth-this.current.offsetX, 0, this.current.offsetX, this.settings.tileHeight, i*this.current.offsetX, this.current.offsetY + (j-1)*self.factorHeight, this.current.offsetX, self.factorHeight);
						}
						
					} else {
						
						if ( j <1) {
					        ctx.drawImage(img, 0, this.settings.tileHeight-this.current.offsetY, this.settings.tileWidth, this.current.offsetY, this.current.offsetX + (i-1)*self.factorWidth, j*this.current.offsetY, self.factorWidth, this.current.offsetY);
				        } else {
					        ctx.drawImage(img, 0, 0, this.settings.tileWidth, this.settings.tileHeight, this.current.offsetX + (i-1)*self.factorWidth, this.current.offsetY + (j-1)*self.factorHeight, self.factorWidth, self.factorHeight)
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
