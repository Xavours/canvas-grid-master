# canvas-grid-master

Canvas-grid-master is an endless grid in canvas to browse a bunch of images.
Work in progress.


## What does it do ?

Canvas-grid-master creates a canvas showinf an endless grid of pictures randomly picked up from an HTMLcollection of image objects. The grid has a lot of customizable settings (see options)


## Getting Started

More to Come

### Arguments

### Example
```javascript
<script type="text/javascript">
  var wall = new Wall('canvas','viewport', array});
</script>
```


## Options

You can tweak how **Canvas Grid Master** playing with the various number of settings :

### Main options

#### `idWrapper`

#### `libraryName`

#### `tileWidth`
Must be a number

#### `tileHeight`
Muste be a number

#### content
Rectangles or images

#### grayScaleOn
True or false

#### fadeAnimation

### Controller options

#### controller
'mouse' 'gamepad' or 'keyboard'

#### moveStep
Must be a number

### Scale options

#### scaleOn
True or false

#### scale
Must be a number. Scale factor

#### minScale
0.25,

#### maxScale
1.75,

#### scaleSensitivity
1

### Spread options
#### spreadMode
random

#### numberTile
100

### Render Options
startX: 0, //  TBD
starY: 0, //  TBD


## Done recently

### New Features added
* Easing
* Custom Events
* Gamepad support
* GrayScale Mode (slow down the whole thing though)

### Fixed
* Scale fom the center of the screen
