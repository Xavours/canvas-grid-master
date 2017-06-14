//  Class Wall
var canvas, ctx;
var lastTileHovered = {};

	//  Debug
	var lastOffsetX = 1;
	var lastPositionX = 1;

	function Wall(id, wrapper, array, params) {
		var self = this;
		this.id = id;
		this.source = array;
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.library = [];
		
		//  Default settings
		this.settings = {
			
			// Main options
			idWrapper: 'viewport',
			tileWidth: 300,
			tileHeight: 400,
			content: 'rectangle',
			grayScaleOn: false,
			fadeAnimation: 'easeOutCubic',
			
			// Controller options
			controller: 'mouse',
			moveStep: 10,

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
				// Mouse
				onClickCallback: function() {console.log('click')},
				mouseoverCallback: function(tile) {self.onMouseover(tile)},

				// Gamepad
				onPressButton1Callback: function() {},
				onPressButton2Callback: function() {},
				onPressButton3Callback: function() {},
				onPressButton4Callback: function() {},

				onPressDPadUpCallback: function() {},
				onPressDPadDownCallback: function() {},
				onPressDPadLeftCallback: function() {},
				onPressDPadRightCallback: function() {},

				onPressStartCallback: function() {},
				onPressSelectCallback: function() {}			

			}
		
		//  Valid Arguments
		if ( Object.toType( this.id ) !== 'string' ) {
			console.error('Argument missing : id must be a string.');
		}

		if ( Object.toType( this.source ) !== 'htmlcollection' ) {
			console.error('Argument missing : library must be an HTMLcollection containing image objects.');
		} else if (typeof this.source == 'undefined' || this.source.length == 0) {
			console.error('The wall cannot be loaded cause an argument is empty or undefined : library must be an HTMLcollection containing image objects.');
		}

		//  Get new settings
		if ( params && validOptions(params) ) {
			$.extend( this.settings, params );
		} else {
			console.error('The wall cannot be loaded because some options are not valid')
		}
		
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
				if ( newX < 0 || newX >= self.settings.numberTile ) {
					var absX = Math.abs(newX);
					finalX = ( isEven( Math.floor( absX/self.settings.numberTile) ) ) ? self.settings.numberTile-absX : absX-self.settings.numberTile;
				}
				
				if ( newY < 0 || newY >= self.settings.numberTile ) {
					var absY = Math.abs(newY);
					finalY = ( isEven( Math.floor( absY/self.settings.numberTile) ) ) ? self.settings.numberTile-absY : absY-self.settings.numberTile;
				}
				
				//console.log( finalX + ' / ' + finalY );
				
				//return this.library[ (this.current.tileX + newX) % self.settings.numberTile ][ (this.current.tileY + newY) % self.settings.numberTile ]; 

				
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
				if ( newX < 0 || newX >= self.settings.numberTile ) {
					var absX = Math.abs(newX);
					this.tileX = ( isEven( Math.floor( absX/self.settings.numberTile) ) ) ? self.settings.numberTile-absX : absX-self.settings.numberTile;
				} else {
					this.tileX = newX;
				}
				
				if ( newY < 0 || newY >= self.settings.numberTile ) {
					var absY = Math.abs(newY);
					this.tileY = ( isEven( Math.floor( absY/self.settings.numberTile) ) ) ? self.settings.numberTile-absY : absY-self.settings.numberTile;
				} else {
					this.tileY = newY;
				}
			}
			
		}

		//  Initialization
		this.init = function () {
			this.generateLibrary();
			this.create();
		}

		//  Generate array of array of Posters
		this.generateLibrary = function () {
			shuffle(this.source);
			for (var i = 0; i < this.settings.numberTile; i++) {
				var col = [];
				for (var j = 0; j < this.settings.numberTile; j++) {
					var poster = new Poster;
					col.push(poster);
				}
				this.library.push(col);
			}
		}

		//  Create or destroy the element "wall"
		this.create = function () {
			$('#' + wrapper).html('<canvas id="' + self.id + '" width="' + self.width + '" height="' + self.height + '">');
			canvas = document.getElementById( self.id );
			ctx = canvas.getContext("2d");

			this.setTrigger();
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
				newY = Math.floor( tempY / this.factorHeight + 1 );
			}
			
			//console.log('x : ' + (this.current.tileX + newX) % self.settings.numberTile + '  /  y : ' + (this.current.tileY + newY) % self.settings.numberTile);
			return this.library[ (this.current.tileX + newX) % self.settings.numberTile ][ (this.current.tileY + newY) % self.settings.numberTile ];
		}

		this.onClick = function (tile) {	    
			this.settings.onClickCallback(tile);
		}
		
		this.onMouseover = function (tile) {
			
			if ( typeof lastTileHovered.color == 'undefined' ) {
				
				self.current.tileHoveredAlpha = 1;
				
				tile.startTime = Date.now();
				tile.alphaEnd = 0.3;
				tile.alphaStart = tile.color.alpha;
				tile.alphaComplete_bl = false;
				tile.hovered = true;
				
				lastTileHovered = tile;
				
			} else if ( tile.hovered !== lastTileHovered.hovered ) {
				
				//  Restore the alpha of the last tile hovered
				lastTileHovered.startTime = Date.now();
				lastTileHovered.alphaEnd = self.current.tileHoveredAlpha;
				lastTileHovered.alphaStart = lastTileHovered.color.alpha;
				lastTileHovered.alphaComplete_bl = false;
				lastTileHovered.hovered = false;
				
				//  Store the actual alpha of the new tile hovered before to change it
				self.current.tileHoveredAlpha = tile.color.alpha;
				
				//  Hover the new tile
				tile.startTime = Date.now();
				tile.alphaEnd = 0.3;
				tile.alphaStart = tile.color.alpha;
				tile.alphaComplete_bl = false;
				tile.hovered = true;
				
				//  Update last tile hovered
				lastTileHovered = tile;
				
			}
			
			//  this.settings.mouseoverCallback();  
		}

		this.tileBlink = function (tile) {	    
			this.settings.onClickCallback(tile);
		}

		//  Viewport move methods
		this.goScale = function (delta) {

			//  Zoom if the option scaleOn is true
			if (this.settings.scaleOn) {
				
				//  Update Scale
				if ( this.scale >= this.settings.minScale && this.scale <= this.settings.maxScale ) { 
					
					var lastScale = this.scale;
					this.scale += (delta/2000);
					var diffScale = this.scale - lastScale;
					
					if (this.scale < this.settings.minScale) {
						this.scale = this.settings.minScale;
					} else if (this.scale > this.settings.maxScale) {
						this.scale = this.settings.maxScale;
					} else {
						
						//  Correct position of viewport to have the feeling that it zooms in the center of the screen
						
							//  Warning : diffScale can be bigger than (maxScale - lastScale) or (lastScale - minScale)
							if ( diffScale > (this.settings.maxScale - lastScale) ) diffscale = this.settings.maxScale - lastScale;
							if ( diffScale > (lastScale - this.settings.minScale) ) diffscale = lastScale - this.settings.minScale;
							
							var correctionX = diffScale * (this.current.viewportX + this.width / 2);
							var correctionY = diffScale * (this.current.viewportY + this.height / 2);
							
							this.current.positionX += correctionX;
							this.current.positionY += correctionY;
						}
					}
				}
			}

			this.goTranslate = function (deltaX, deltaY) {

			//  Update PositionX
			this.current.positionX += deltaX;
			this.current.positionY += deltaY;
			
			//  Update ViewportX
			this.current.viewportX += deltaX / this.scale;
			this.current.viewportY += deltaY / this.scale;
		}

		//  Rendering methods
		this.render = function () {
			
			//  Update Data
			this.updateScale();
			this.updateNumberTile();
			this.current.getTile(this.current.positionX, this.current.positionY)
			
			//  Clear canvas
			ctx.clearRect(0, 0, self.width, self.height);
			
			//  Choose rendering mode
			if (this.settings.content == 'image') this.drawImages();
			if (this.settings.content == 'image' & this.settings.grayScaleOn) this.grayScale();
			else if (this.settings.content == 'rectangle') this.drawRectangles();
			
		}
		
		this.drawRectangles = function () {
			for (var i = 0; i < self.numberRow; i++) {
				for (var j = 0; j < self.numberCol; j++) {
					
					var x = (this.current.tileX+i) % self.settings.numberTile;
					var y = (this.current.tileY+j) % self.settings.numberTile;
					var currentPoster = this.source[x][y];

					//  Get the color of the rectangle
					currentPoster.fade();
					ctx.fillStyle = currentPoster.rgba;
					
					//  Optimisations
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
					
					var x = (this.current.tileX+i) % self.settings.numberTile;
					var y = (this.current.tileY+j) % self.settings.numberTile;
					
					//console.log(this.library);
					var currentPoster = this.library[x][y];
					
					
					//  Get the source of images
					var img = new Image();
					
					//console.log(currentPoster.imgSrc);
					img.src = currentPoster.imgSrc;
					
					//  Get the alpha
					currentPoster.fade();
					ctx.globalAlpha = currentPoster.color.alpha;
					if (currentPoster.focus == true) ctx.globalAlpha = 0.3;
					
					
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

		this.grayScale = function () {
			
			// Store the data
			this.imageData = ctx.getImageData(0, 0, this.width, this.height);
			var data = this.imageData.data;

			for(var i = 0; i < data.length; i += 4) {
				var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
			  // red
			  data[i] = brightness;
			  // green
			  data[i + 1] = brightness;
			  // blue
			  data[i + 2] = brightness;
		  }

			// overwrite original image
			ctx.putImageData(this.imageData, 0, 0);
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
		rgba: function() {
			var c = self.color;
			return [c.red, c.green, c.blue, c.alpha].join(",");
		}
	};
	this.width = 50;
	this.height = 50;
	this.inViewport_bl = false;
	this.blacked_bl = true;
	this.factor = 1;
	this.alphaStart = 0;
	this.alphaEnd = 1;
	this.alphaComplete_bl = false;				
	this.alphaDelta;
	this.rgba;
	this.hovered = false;
	this.focus = false;

	//  Apply Spread Mode
	if (wall.settings.spreadMode == 'random') {
		this.imgSrc = wall.source[randomPick(0, wall.source.length)].src;

	} else if (wall.settings.spreadMode == 'shuffle') {
		if (shuffleCounter == wall.source.length) {
			shuffle(wall.source);
			shuffleCounter = 0;
		}
		
		if( Object.toType(this.addKeys) === 'function') this.addKeys();
		this.imgSrc = wall.source[shuffleCounter].src;

		shuffleCounter++;
		//console.log(shuffleCounter);
	};

	//  Determine what is the level of fade of the tile
	this.calculAlpha = function () {
		
		//  Calcul delta
		this.alphaDelta = this.alphaEnd - this.alphaStart;
		
		this.time = Date.now();
		this.currentTime = this.time - this.startTime;
		this.color.alpha = easeOutCubic(this.currentTime, this.alphaStart, this.alphaDelta, 1000);
		
		//  If time is over, give it the alphaEnd or alpha > alphaEnd
		if (this.currentTime > 1000) {
			this.color.alpha = this.alphaEnd;
			this.alphaComplete_bl = true;
		}
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
	} else if ( this.inViewport_bl && !this.blacked_bl && !this.alphaComplete_bl){
		
		this.calculAlpha();
		this.rgba = "rgba(" + this.color.rgba() + ")";
		
		}
	}
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

var iFrequency = 50; // expressed in miliseconds
var myInterval = 0;

// STARTS and Resets the loop if any
function debug(tile) {
	if(myInterval > 0) clearInterval(myInterval);  // stop
	myInterval = setInterval( "doSomething(tile)", iFrequency );  // run
}

function doSomething(tile) {
	console.log('alpha : ' + tile.color.alpha);
}

function stop() {
	clearInterval(myInterval);
}
