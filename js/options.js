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

		//console.log(param);
		//console.log( window[param.libraryName] );
		
		//  Main options
		if ( param.hasOwnProperty('wrapper') ) {
			if( Object.toType(param.content) !== 'string'){
				console.error('The option "wrapper" must be a string');
				valid = false;
			}
		}

		if ( param.hasOwnProperty('tileWidth') ) {
			if( Object.toType(param.tileWidth) !== 'number'){
				console.error('The option "tileWidth" must be a number');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('tileHeight') ) {
			if( Object.toType(param.tileHeight) !== 'number'){
				console.error('The option "tileHeight" must be a number');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('content') ) {
			if( Object.toType(param.content) !== 'string'){
				console.error('The option "content" must be a string');
				valid = false;
			} else if ( param.content !== 'image' && param.content !== 'rectangle') {
				console.error('The option "content" : ' + param.content + ' is not a valid');
				valid = false;
			}
		}

		if ( param.hasOwnProperty('grayScaleOn') ) {
			if( Object.toType(param.scaleOn) !== 'boolean'){
				console.error('scaleOn must be a boolean');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('fadeAnimation') ) {
			if( Object.toType(param.fadeAnimation) !== 'string'){
				console.error('The option "fadeAnimation" must be a string');
				valid = false;
			} else if ( param.fadeAnimation !== 'easeOutCubic' ) {
				console.error('The option "fadeAnimation" : ' + param.fadeAnimation + ' is not a valid');
				valid = false;
			}
		}

		//  Controllers options
		if ( param.hasOwnProperty('controller') ) {
			if( Object.toType(param.controller) !== 'string'){
				console.error('The option "controller" must be a string');
				valid = false;
			} else if ( param.controller !== 'mouse' && param.controller !== 'keyboard' && param.controller !== 'gamepad') {
				console.error('The option "controller" : ' + param.controller + ' is not a valid');
				valid = false;
			}
		}

		if ( param.hasOwnProperty('moveStep') ) {
			if( Object.toType(param.moveStep) !== 'number'){
				console.error('The option "moveStep" must be a number');
				valid = false;
			}
		}
		
		//  Scale Options
		if ( param.hasOwnProperty('scaleOn') ) {
			if( Object.toType(param.scaleOn) !== 'boolean'){
				console.error('The option "scaleOn" must be a boolean');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('scale') ) {
			if( Object.toType(param.scale) !== 'number'){
				console.error('The option "scale" must be a number');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('minScale') ) {
			if( Object.toType(param.minScale) !== 'number'){
				console.error('The option "minScale" must be a number');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('maxScale') ) {
			if( Object.toType(param.maxScale) !== 'number'){
				console.error('The option "maxScale" must be a number');
				valid = false;
			}
		}
		
		
		//  Spread mode
		if ( param.hasOwnProperty('spreadMode') ) {
			if( Object.toType(param.spreadMode) !== 'string'){
				console.error('The option "spreadMode" must be a string');
				valid = false;
			} else if ( param.spreadMode !== 'random' && param.spreadMode !== 'shuffle') {
				console.error('The option "spreadMode" : ' + param.spreadMode + ' is not a valid');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('numberTile') ) {
			if( Object.toType(param.numberTile) !== 'number'){
				console.error('The option "numberTile" must be a number');
				valid = false;
			}
		}
		
		
		//  Methods
		if ( param.hasOwnProperty('onClickCallback') ) {
			if( Object.toType(param.onClickCallback) !== 'function'){
				console.error('The option "onClickCallback" must be a function');
				valid = false;
			}
		}
		
		if ( param.hasOwnProperty('mouseoverCallback') ) {
			if( Object.toType(param.mouseoverCallback) !== 'function'){
				console.error('The option ""mouseoverCallback" must be a function');
				valid = false;
			}
		}
	
	return valid;
}