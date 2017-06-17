# canvas-grid-master v 0.6 [![Size](http://img.badgesize.io/xavours/canvas-grid-master/master/dist/canvas-grid-master.min.js?compression=gzip&color=blue)](https://raw2.github.com/xavours/canvas-grid-master/master/dist/canvas-grid-master.min.js)

**Canvas-grid-master** is an endless grid in canvas to browse a bunch of images.
Work in progress.


## What does it do ?

**Canvas-grid-master** creates a canvas showinf an endless grid of pictures randomly picked up from an HTMLcollection of image objects. The grid has a lot of customizable settings (see options).


## Getting Started

### Download

+ [canvas-grid-master.min.js](https://github.com/xavours/canvas-grid-master/master/dist/canvas-grid-master.min.js) minified

### Getting started

**Canvas-grid-master** requires a canvas id, a wrapper and an htmlcollection of images object as a library of images.

### Example

Create the wrapper
```html
<div id='viewport'></div>
```
Build the library
```javascript
for ( var i=0; i <= 32; i++) {
	var img = document.createElement("img");
	img.src = 'images' + i + '.jpg';
	img.setAttribute("class", "library");
	document.body.appendChild(img);
}
var library = document.getElementsByClassName('library')
```
Build the wall
```javascript
<script type="text/javascript">
  var wall = new Wall('canvas','viewport', library});
  wall.init();
</script>
```

## Options

You can tweak **Canvas Grid Master** in many ways playing with a various number of settings which are all optional:

### Main options

#### `tileWidth`
+ Width of each tile
+ Integer
+ By default: 300px

#### `tileHeight`
+ Height of each tile
+ Integer
+ By default: 400px

#### `grayScaleOn`
+ Enable the rendering of the images in black & white
+ Boolean
+ By default: false

#### `fadeAnimation`
+ Custom the easing when when a new tile fades in
+ 'easeOutCubic', 'easeOutQuart','easeInOutSine', 'easeCustom' or 'easeOutCubic'
+ By default: 'easeOutCubic'


### Controller options

#### `controller`
+ Determinate what controllers make the wall move
+ 'mouse', 'keyboard' or 'gamepad'
+ By default: mouse

#### `moveStep`
+ Increment in the wall translation (up/down, left/right)
+ Integer
+ By default: 10


### Scale options

#### `scaleOn`
+ Enable scale property
+ Boolean
+ By default: true

#### `scale`
+ Scale factor at the creation of the wall.
+ Integer
+ By default: 1

#### `minScale`
+ Minimum scaling factor : for example a minScale = 0.25 means that the wall won't zoom out anymore if the tiles are already as small as a quarter of their original size. Set the minScale too low and you'll decrease significantly your performance.
+ Integer
+ By default: 0.25

#### `maxScale`
+ Maximum scaling factor : for example a maxScale = 1.75 means that the wall won't zoom in anymore if the tiles are already as big as 175% of their original size. Set the maxScale too high and you'll lose image resolution.
+ Integer
+ By default: 1.75

#### `scaleSensitivity`
+ Scale sensitivity
+ Integer
+ By default: 1

### Spread options

#### `spreadMode`
+ Describes how the images are spread. 'random' means totally randomly as a same image can be shown multiple times in a row. 'shuffle' means that the library is shuffled then all the pictures are laid out and again and again... Note that the image are laid out from left to right and up to down. 
+ 'random' or 'shuffle'
+ By default: 'random'

#### `numberTile`
+ Number of rows and columns of tiles to be laid out. a numberTile = 100 means a 100 * 100 grid.
+ Integer
+ By default: 100

### Render Options
startX: 0, //  TBD
starY: 0, //  TBD


## Methods

To be done


## Notes

This script has been developped for the project flyposter.ca. **Canvas-grid-master** is licensed under the MIT Licence.

## Projects using Canvas Grid Master

- Flyposter: http://www.flyposter.ca
- Others?


## Release History

```
v0.6
- New Features added
  * Cleaner code
  * New method to control rendering
  * Documentation 

```

```
v0.5
- New Features added
  * Easing
  * Custom Events
  * Gamepad support
  * GrayScale Mode (slow down the whole thing though)

- Fixed
  * Scale fom the center of the screen
```

## Author

| [Xavier Orssaud](http://xavierorssaud.com) |
