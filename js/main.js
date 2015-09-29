//  Pick random number
    function randomPick(min, max) {
    return Math.floor(Math.random() * max) + min;
    }




//  Class Wall
	var canvas, ctx;

    function Wall(id, idParent) {
	    var self = this;
	    this.id = id;
	    this.idParent = idParent;
	    this.width = $(window).width();
	    this.height = $(window).height();
	    this.tile = {
	        width: 50,
	        height: 50,
	        updateNumberTile: function () {
	            this.numberRow = Math.ceil(self.width / this.width),
	            this.numberCol = Math.ceil(self.height / this.height)
	        }
	    }
	    this.scale = 1;
	    this.updateScale = function () {
	        this.factorWidth = this.tile.width * this.scale;
	        this.factorHeight = this.tile.height * this.scale;
	    }
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
	            
	            console.log('current.tileX : ' + this.tileX + ' / current.offsetX : ' + this.offsetX);
	            console.log('current.tileY : ' + this.tileY + ' / current.offsetY : ' + this.offsetY);
	        }
	    }
	    this.create = function () {
		    $('#' + idParent).html('<canvas id="' + self.id + '" width="' + self.width + '" height="' + self.height + '">');
		    canvas = document.getElementById( self.id )
			ctx = canvas.getContext("2d");
			
	    }
	    this.render = function (array) {
	    
	    	//  Update Data
	    	wall.current.positionX += -deltaX;
	        wall.current.positionY += -deltaY;
	        this.updateScale();
	        this.tile.updateNumberTile();
	        this.current.getCurrentTile(this.current.positionX, this.current.positionY)
	        
	        //  Clear canvas
	        ctx.clearRect(0, 0, self.width, self.height);
	        
	        //  Draw columns
	        for (var i = 0; i <= self.tile.numberRow; i++) {
	        	for (var j = 0; j <= self.tile.numberCol; j++) {
			        ctx.fillStyle = "rgb(" + array[this.current.tileX + i][this.current.tileY + j].color.red + "," + array[this.current.tileX + i][this.current.tileY + j].color.green + "," + array[this.current.tileX + i][this.current.tileY + j].color.blue + ")";
			        
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
					        ctx.fillRect(this.current.offsetX + (i-1)*self.tile.width, this.current.offsetY + (j-1)*self.tile.height, this.current.offsetX + i*self.tile.width, this.current.offsetY + j*self.tile.height);
					        
						}
					}
				}
		    }
	        
	    }
}

//  Class Poster
function Poster() {
	this.color = {
	    red: randomPick(1, 255),
	    green: randomPick(1, 255),
	    blue: randomPick(1, 255)
	};
	this.width = 50;
	this.height = 50 }

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
