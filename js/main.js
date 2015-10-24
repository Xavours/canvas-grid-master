//  Pick random number
    function randomPick(min, max) {
    return Math.floor(Math.random() * max) + min;
    }
var smallestWidth = 0,
smallestHeight = 0,
largestWidth = 100,
largestHeight = 100;

function validOption(which, param){
	var valid = true;
	if(which == 'tile'){
		if(typeof param.width !== 'number') valid = false;
		if(typeof param.height !== 'number') valid = false;
		if(param.width >= smallestWidth && param.width < largestWidth) valid = false;
		if(param.width >= smallestHeight && param.width < largestHeight) valid = false;
	}
	
	return valid;
}

//  Class Wall
	var canvas, ctx;

    function Wall(id, idParent, params) {
	    var self = this;
	    this.id = id;
	    this.idParent = idParent;
	    this.width = $(window).width();
	    this.height = $(window).height();
	    this.tile = params && params.tile && validOption('tile', params.tile)?params.tile:{
	        width: 50,
	        height: 50,
	        
	    }
	    this.tile.updateNumberTile = function () {
	            this.numberRow = Math.ceil(self.width / this.width),
	            this.numberCol = Math.ceil(self.height / this.height)
	        }
	    
	    //  Handle the change of scale
	    this.scale = 1;
	    this.updateScale = function () {
	        this.factorWidth = this.tile.width * this.scale;
	        this.factorHeight = this.tile.height * this.scale;
	    }
	    
	    //  Take care of the viewport = "what appears on the window"
	    this.viewport = {
	        minX: 0,
	        minY: 0,
	        maxX: self.width,
	        maxY: self.height
	    }
	    this.updateViewport = function () {
	        this.factorWidth = this.tile.width * this.scale;
	        this.factorHeight = this.tile.height * this.scale;
	    },
	    
	    
	    this.current = {
	        positionX: Math.floor(self.width / 2),
	        positionY: Math.floor(self.height / 2),
	        getCurrentTile: function (x, y) {
	            this.tileX = Math.floor(x / self.tile.width) + 1;
	            this.offsetX = self.tile.width - ( x % self.tile.width );
	            this.tileY = Math.floor(y / self.tile.height) + 1;
	            this.offsetY =  self.tile.height - ( y % self.tile.height ); 
	            
	            //console.log('current.tileX : ' + this.tileX + ' / current.offsetX : ' + this.offsetX);
	            //console.log('current.tileY : ' + this.tileY + ' / current.offsetY : ' + this.offsetY);
	        }
	    }
	    
	    //  Create the element "wall"
	    this.create = function () {
		    $('#' + idParent).html('<canvas id="' + self.id + '" width="' + self.width + '" height="' + self.height + '">');
		    canvas = document.getElementById( self.id )
			ctx = canvas.getContext("2d");
			
	    }
	    
	    //  Render the Wall
	    this.render = function (array) {
	    
	    	//  Update Data
	    	wall.current.positionX += -deltaX;
	        wall.current.positionY += -deltaY;
	        this.updateScale();
	        this.tile.updateNumberTile();
	        this.current.getCurrentTile(this.current.positionX, this.current.positionY)
	        
	        //  Clear canvas
	        ctx.clearRect(0, 0, self.width, self.height);
	        
	        //  Draw rectangles
	        for (var i = 0; i <= self.tile.numberRow/2; i++) {
	        	for (var j = 0; j <= self.tile.numberCol/2; j++) {
	        	
	        		var currentPoster = array[this.current.tileX + i][this.current.tileY + j];
	        		
	        		//  Get the color of the rectangle
	        		currentPoster.fade();
			        ctx.fillStyle = currentPoster.rgba;
			        
			        if ( i <=1) {
				        
				        if ( j <=1) {
					        ctx.fillRect(i*this.current.offsetX, j*this.current.offsetY, this.current.offsetX + i*self.tile.width, this.current.offsetY + j*self.tile.height);
				        } else {
					        ctx.fillRect(i*this.current.offsetX, this.current.offsetY + (j-1)*self.tile.height, this.current.offsetX + i*self.tile.width, this.current.offsetY + j*self.tile.height);
						}
						
					} else {
						
						if ( j <=1) {
					        ctx.fillRect(this.current.offsetX + (i-1)*self.tile.width, j*this.current.offsetY, this.current.offsetX + i*self.tile.width, this.current.offsetY + j*self.tile.height);
				        } else {
					        ctx.fillRect(this.current.offsetX + (i-1)*self.tile.width, this.current.offsetY + (j-1)*self.tile.height, this.current.offsetX + i*self.tile.width, this.current.offsetY + j*self.tile.height)
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
