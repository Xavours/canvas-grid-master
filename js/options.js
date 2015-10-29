/*  Determine if a variable is an object
/  Source : https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
*/
Object.toType = (function toType(global) {
  return function(obj) {
    if (obj === global) {
      return "global";
    }
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  }
})(this)

//  Valid Arguments
function validArg(param){
	var valid = true;
	
	//  Check if param is an object
	if (param === 'undefined') {
		console.error('Settings object is undefined');
		valid = false;
		return valid;
		
	} else if (param === null) {
		console.error('Settings object is null');
		valid = false;
		return valid;
		
	} else if (!param && Object.toType(param)) {
		console.log('Settings object valid');
	}
	
	//  Check if properties one by one
	if ( param.hasOwnProperty('tileWidth') ) {
		if( Object.toType(param.tileWidth) !== 'number'){
			console.error('TileWidth is not a number');
			valid = false;
		}
	}
	
	if ( param.hasOwnProperty('tileHeight') ) {
		if( Object.toType(param.tileHeight) !== 'number'){
			console.error('tileHeight is not a number');
			valid = false;
		}
	}
	
	if ( param.hasOwnProperty('content') ) {
		if( Object.toType(param.content) !== 'string'){
			console.error('tileHeight is not a string');
			valid = false;
		} else if ( param.content !== 'image' || param.content !== 'rectangle') {
			console.error('content : ' + param.content + 'is not a valid option');
			valid = false;
		}
	}
	
	if ( param.hasOwnProperty('fadeAnimation') ) {
		if( Object.toType(param.fadeAnimation) !== 'string'){
			console.error('tileHeight is not a string');
			valid = false;
		} else if ( param.fadeAnimation !== 'easeOutCubic' ) {
			console.error('fadeAnimation : ' + param.fadeAnimation + 'is not a valid option');
			valid = false;
		}
	}
	
	return valid;
}

//  Valid Options
function validOptions(param){
	var valid = true;
	
	//  Check if param is an object
	if (param === 'undefined') {
		console.error('Settings object is undefined');
		valid = false;
		return valid;
		
	} else if (param === null) {
		console.error('Settings object is null');
		valid = false;
		return valid;
		
	} else if (!param && Object.toType(param)) {
		console.log('Settings object valid');
	}
	
	//  Check if properties one by one
		
		//  Tile size
		if ( param.hasOwnProperty('tileWidth') ) {
			if( Object.toType(param.tileWidth) !== 'number'){
				console.error('TileWidth is not a number');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('tileHeight') ) {
			if( Object.toType(param.tileHeight) !== 'number'){
				console.error('tileHeight is not a number');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('content') ) {
			if( Object.toType(param.content) !== 'string'){
				console.error('content is not a string');
				valid = false;
			} else if ( param.content !== 'image' && param.content !== 'rectangle') {
				console.error('content : ' + param.content + ' is not a valid option');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('fadeAnimation') ) {
			if( Object.toType(param.fadeAnimation) !== 'string'){
				console.error('tileHeight is not a string');
				valid = false;
			} else if ( param.fadeAnimation !== 'easeOutCubic' ) {
				console.error('fadeAnimation : ' + param.fadeAnimation + ' is not a valid option');
				valid = false;
			}
		}
		
		
		//  Scale Options
		if ( param.hasOwnProperty('scaleOn') ) {
			if( Object.toType(param.scaleOn) !== 'boolean'){
				console.error('scaleOn is not a boolean');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('scale') ) {
			if( Object.toType(param.scale) !== 'number'){
				console.error('scale is not a number');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('minScale') ) {
			if( Object.toType(param.minScale) !== 'number'){
				console.error('minScale is not a number');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('maxScale') ) {
			if( Object.toType(param.maxScale) !== 'number'){
				console.error('maxScale is not a number');
				valid = false;
			}
		}
	
	return valid;
}