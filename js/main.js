//  Pick random number
    function randomPick(min, max) {
    return Math.floor(Math.random() * max) + min;
    }




//  Class Wall
	var canvas, ctx;

    function Wall(id, idParent) {
	    var that = this;
	    that.id = id;
	    that.idParent = idParent;
	    that.width = $(window).width();
	    that.height = $(window).height();
	    that.tile = {
	        width: 50,
	        height: 50,
	        updateNumberTile: function () {
	            this.numberRow = Math.ceil(that.width / this.width),
	            this.numberCol = Math.ceil(that.height / this.height)
	        }
	    }
	    that.scale = 1;
	    that.updateScale = function () {
	        this.factorWidth = this.tile.width * this.scale;
	        this.factorHeight = this.tile.height * this.scale;
	    }
	    that.viewport = {
	        minX: 0,
	        minY: 0,
	        maxX: that.width,
	        maxY: that.height
	    }
	    that.updateViewport = function () {
	        this.factorWidth = this.tile.width * this.scale;
	        this.factorHeight = this.tile.height * this.scale;
	    },
	    that.current = {
	        positionX: Math.floor(that.width / 2),
	        positionY: Math.floor(that.height / 2),
	        getCurrentTile: function (x, y) {
	            this.tileX = Math.floor(x / that.tile.width) + 1;
	            this.offsetX = that.tile.width - ( x % that.tile.width );
	            this.tileY = Math.floor(y / that.tile.height) + 1;
	            this.offsetY =  that.tile.height - ( y % that.tile.height ); 
	            
	            console.log('current.tileX : ' + this.tileX + ' / current.offsetX : ' + this.offsetX);
	            console.log('current.tileY : ' + this.tileY + ' / current.offsetY : ' + this.offsetY);
	        }
	    }
	    that.create = function () {
		    $('#' + idParent).html('<canvas id="' + that.id + '" width="' + that.width + '" height="' + that.height + '">');
		    canvas = document.getElementById( that.id )
			ctx = canvas.getContext("2d");
			
	    }
	    that.render = function (array) {
	    
	    	//  Update Data
	        this.updateScale();
	        this.tile.updateNumberTile();
	        this.current.getCurrentTile(this.current.positionX, this.current.positionY)
	        
	        //  Clear canvas
	        ctx.clearRect(0, 0, that.width, that.height);
	        
	        
	        /*
//  Draw first column
	        for (var j = 0; j < that.tile.numberCol; j++) {
		        ctx.fillStyle = "rgb(" + array[this.current.tileX][this.current.tileY + j].color.red + "," + array[this.current.tileX][this.current.tileY + j].color.green + "," + array[this.current.tileX][this.current.tileY + j].color.blue + ")";
		        if ( j <=1) {
			        ctx.fillRect(0, j*this.current.offsetY, this.current.offsetX, this.current.offsetY + j*that.tile.height);
		        } else {
			        ctx.fillRect(0, this.current.offsetY + (j-1)*that.tile.height, this.current.offsetX, this.current.offsetY + j*that.tile.height);
		        }
		    }
		    
		    //  Draw second column
	        for (var j = 0; j < that.tile.numberCol; j++) {
		        ctx.fillStyle = "rgb(" + array[this.current.tileX + 1][this.current.tileY + j].color.red + "," + array[this.current.tileX + 1][this.current.tileY + j].color.green + "," + array[this.current.tileX + 1][this.current.tileY + j].color.blue + ")";
		        if ( j <=1) {
			        ctx.fillRect(this.current.offsetX, j*this.current.offsetY, that.tile.width, this.current.offsetY + j*that.tile.height);
		        } else {
			        ctx.fillRect(this.current.offsetX, this.current.offsetY + (j-1)*that.tile.height, that.tile.width, this.current.offsetY + j*that.tile.height);
		        }
		    }
		    
		    //  Draw third column
	        for (var j = 0; j < that.tile.numberCol; j++) {
		        ctx.fillStyle = "rgb(" + array[this.current.tileX + 2][this.current.tileY + j].color.red + "," + array[this.current.tileX + 2][this.current.tileY + j].color.green + "," + array[this.current.tileX + 2][this.current.tileY + j].color.blue + ")";
		        if ( j <=1) {
			        ctx.fillRect(this.current.offsetX + that.tile.width, j*this.current.offsetY, that.tile.width, this.current.offsetY + j*that.tile.height);
		        } else {
			        ctx.fillRect(this.current.offsetX + that.tile.width, this.current.offsetY + (j-1)*that.tile.height, that.tile.width, this.current.offsetY + j*that.tile.height);
		        }
		    }
		    
		    //  Draw fourth column
	        for (var j = 0; j < that.tile.numberCol; j++) {
		        ctx.fillStyle = "rgb(" + array[this.current.tileX + 3][this.current.tileY + j].color.red + "," + array[this.current.tileX + 3][this.current.tileY + j].color.green + "," + array[this.current.tileX + 3][this.current.tileY + j].color.blue + ")";
		        if ( j <=1) {
			        ctx.fillRect(this.current.offsetX + 2*that.tile.width, j*this.current.offsetY, that.tile.width, this.current.offsetY + j*that.tile.height);
		        } else {
			        ctx.fillRect(this.current.offsetX + 2*that.tile.width, this.current.offsetY + (j-1)*that.tile.height, that.tile.width, this.current.offsetY + j*that.tile.height);
		        }
		    }
*/
	        
	        //  Draw columns
	        for (var i = 0; i <= that.tile.numberRow; i++) {
	        	for (var j = 0; j <= that.tile.numberCol; j++) {
			        ctx.fillStyle = "rgb(" + array[this.current.tileX + i][this.current.tileY + j].color.red + "," + array[this.current.tileX + i][this.current.tileY + j].color.green + "," + array[this.current.tileX + i][this.current.tileY + j].color.blue + ")";
			        
			        if ( i <=1) {
				        
				        if ( j <=1) {
					        ctx.fillRect(i*this.current.offsetX, j*this.current.offsetY, this.current.offsetX + i*that.tile.width, this.current.offsetY + j*that.tile.height);
				        } else {
					        ctx.fillRect(i*this.current.offsetX, this.current.offsetY + (j-1)*that.tile.height, this.current.offsetX + i*that.tile.width, this.current.offsetY + j*that.tile.height);
						}
						
					} else {
						
						if ( j <=1) {
					        ctx.fillRect(this.current.offsetX + (i-1)*that.tile.width, j*this.current.offsetY, this.current.offsetX + i*that.tile.width, this.current.offsetY + j*that.tile.height);
				        } else {
					        ctx.fillRect(this.current.offsetX + (i-1)*that.tile.width, this.current.offsetY + (j-1)*that.tile.height, this.current.offsetX + i*that.tile.width, this.current.offsetY + j*that.tile.height);
					        
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
	this.height = 50
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
