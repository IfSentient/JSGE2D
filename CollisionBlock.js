var CollisionBlock = function(args) {
	this.width = (args.width !== undefined)? args.width : 0;
	this.height = (args.height !== undefined)? args.height : 0;
	this.bits = [];
	
	var collision_array = args.matrix;
	if(collision_array === undefined) collision_array = [[1]];
	
	var noteven = false;
	var longest = collision_array[0].length;
	for(var i=0; i<collision_array.length; i++) { if(longest != collision_array[i].length) { longest = collision_array[i].length; noteven = true; } }
	if(noteven) { for(var i=0; i<collision_array.length; i++) { for(var j=0; j<longest; j++) { if(collision_array[i][j] === undefined) { collision_array[i][j] = 0; } } } }
		
	var pixels = collision_array;
	if(this.width == 0) this.width = pixels[0].length;
	if(this.height == 0) this.height = pixels.length
	
	if(this.width > collision_array[0].length) {
		pixels = [];
		var clone = this.width % collision_array[0].length;
		var cloneindex = Math.floor(collision_array[0].length / 2) - 1;
		var multiply = Math.floor(this.width / collision_array[0].length);
		for(var i=0; i<collision_array.length; i++) {
			pixels[i] = [];
			var cloned = false;
			for(var j=0; j<collision_array[i].length; j++) {
				for(var k=0; k<multiply; k++) pixels[i][(j*multiply)+k+(cloned? clone : 0)] = collision_array[i][j];
				if(j == cloneindex) { for(var k=0; k<clone; k++) pixels[i][((j*multiply)+multiply+k)] = collision_array[i][j]; cloned = true; }
			}
		}
	}
	
	if(this.height > collision_array.length) {
		var clone = this.height % collision_array.length;
		var cloneindex = Math.floor(collision_array.length / 2) - 1;
		var multiply = Math.floor(this.height / collision_array.length);
		var cloned = false;
		for(var i=0; i<collision_array.length; i++) {
			for(var j=0; j<multiply-1+(i == cloneindex? clone : 0); j++) pixels.splice((i*multiply)+(cloned? clone : 0),0,pixels[i*multiply]);
		}
	}
	
	var len = Math.ceil(this.width / 32);
	for(var i=0; i<pixels.length; i++) {
		this.bits[i] = [];
		for(var j=0; j<len; j++) {
			this.bits[i][j] = 0;
			for(var k=0; k<32; k++) {
				if(pixels[i][k] === undefined && j == len-1) break;
				this.bits[i][j] += pixels[i][k] == 0? 0 : Math.pow(2,32-k-1);
			}
		}
	}
	
}

CollisionBlock.prototype.isOverlapping = function(args) {
	var other_cb = args.collisionBlock;
	if(other_cb === undefined || !(other_cb instanceof CollisionBlock)) return false;
	var x_offset = (args.xOffset !== undefined)? args.xOffset : 0;
	var y_offset = (args.yOffset !== undefined)? args.yOffset : 0;
	
	if(x_offset > this.width || x_offset + other_cb.width < 0 || y_offset > this.height || y_offset + other_cb.height < 0) return false;
	
	var obits = other_cb.bits.slice(0);
	var xoff = Math.floor(x_offset);
	var yoff = Math.floor(y_offset);
	
	if(xoff > 0) { /* shift right by xOffset */
		var skip = Math.floor(xoff/32);
		var xs = (skip >= 1)? xoff % 32 : xoff;
		for(var i=0; i<this.bits.length; i++) {
			if(obits[i] === undefined) break;
			var buffer = [];
			for(var j=0; j<this.bits[i].length; j++) {
				buffer[j] = 0;
				if(j-skip >= 0) {
					buffer[j] = obits[i][j-skip] >>> xs;
					if(j-skip-1 >= 0) buffer[j] = buffer[j] | (obits[i][j-skip-1] << (32-xs));
				}
			}
			obits[i] = buffer;
		}
	} else if(xoff < 0) { /* shift left by xOffset */
		var skip = Math.floor((xoff * -1) / 32);
		var xs = (skip >= 1)? (xoff * -1) % 32 : xoff * -1;
		for(var i=0; i<this.bits.length; i++) {
			if(obits[i] === undefined) break;
			var buffer = [];
			var len = obits[i].length;
			for(var j=0; j<len; j++) {
				buffer[len-1-j] = 0;
				if(skip-1-j < 0) {
					buffer[len-1-j] = (obits[i][len+skip-1-j] << xs) >>> 0; /* JavaScript will do dumb sign bit stuff if >>> 0 isn't present to make it use this as an unsigned int */
					if(skip-j < 0) buffer[len-1-j] = buffer[len-1-j] | (obits[i][len+skip-j] >>> (32 - xs));
				}
			}
			
			obits[i] = buffer;
		}
	}
	
	if(yoff > 0) { /* shift down by yOffset */
		for(var i=0; i<yoff; i++) obits.splice(0,0,[]);
	} else if(yoff < 0) { /* shift up by yOffset */
		obits.splice(0,yoff*-1);
	}
	
	/* check overlap */
	for(var i=0; i<this.bits.length; i++) {
		for(var j=0; j<this.bits[i].length; j++) {
			if(obits[i] !== undefined && obits[i][j] !== undefined && (this.bits[i][j] & obits[i][j])) return true;
		}
	}
	return false;
}