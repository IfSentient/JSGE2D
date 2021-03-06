var TileSet = function(args) {
	this.image = new Image();
	this.image.src = (args.src !== undefined)? args.src : '';
	
	this.tile_size = (args.tileWidth !== undefined)? args.tileWidth : 16; /* The size of a tile (NOTE: tiles are always a square size (e.g. 16x16)) */
	this.rows = (args.rows !== undefined)? args.rows : 0;	/* The number of tiles in a row of our background */
	this.cols = (args.cols !== undefined)? args.cols : 0; /* The number of tiles in a column of our background */
	this.tiles_in_image = (args.tilesPerRow !== undefined)? args.tilesPerRow : 16; /* The number of tiles per row in the TileSet image */
	this.margin = (args.margin !== undefined) ? args.margin : 0;
	
	this.layers = [];
	this.layer_z = [];
}

TileSet.prototype.setBGSize = function(args) { this.rows = (args.rows !== undefined)? args.rows : this.rows; this.cols = (args.cols !== undefined)? args.cols : this.cols; }

TileSet.prototype.setLayer = function(args) {
	var layer = args.layer;
	var z_index = (args.zIndex !== undefined)? args.zIndex : 0;
	if(layer === undefined) return;
	
	var insert_index = -1;
	var insert_before = false;	
	for(var i=0; i<this.layer_z.length; i++) {
		if(z_index <= this.layer_z[i]) { 
			insert_index = i;
			insert_before = (z_index != this.layer_z[i]);
			if(z_index < this.layer_z[i]) this.layer_z.splice(i,0,z_index);
			break;
		}
	}
	if(insert_index >= 0) {
		if(insert_before) this.layers.splice(insert_index,0,layer);
		else this.layers[insert_index] = layer;
	} else {
		this.layers[this.layers.length] = layer;
		this.layer_z[this.layer_z.length] = z_index;
	}
}
TileSet.prototype.getLayer = function(z_index) { return this.layers[z_index]; }
TileSet.prototype.clearLayers = function() { this.layers = []; }

TileSet.prototype.getHeight = function() { return (this.layers[0] === undefined)? 0 : this.layers[0].length*this.tile_size; }
TileSet.prototype.getWidth = function() { return (this.layers[0] === undefined || this.layers[0][0] === undefined)? 0 : this.layers[0][0].length*this.tile_size; }

TileSet.prototype.getZLayers = function() { return this.layer_z; }

TileSet.prototype.drawLayer = function(args) {
	var context = args.context;
	if(context === undefined) return;
	var z_index = (args.zIndex !== undefined)? args.zIndex : 0;
	var startX = (args.startX !== undefined)? args.startX : 0;
	var startY = (args.startY !== undefined)? args.startY : 0;
	var scrWidth = (args.width !== undefined)? args.width : this.rows * this.tile_size;
	var scrHeight = (args.height !== undefined)? args.height : this.cols * this.tile_size;
	var draw_x = (args.drawX !== undefined)? args.drawX : 0;
	var draw_y = (args.drawY !== undefined)? args.drawY : 0;
	
	scrWidth -= this.tile_size;
	scrHeight -= this.tile_size;
	
	var idx = -1;
	for(var i=0; i<this.layer_z.length; i++) { if(this.layer_z[i] == z_index) idx = i; }
	if(idx == -1 || this.layers[idx] === undefined) return;
	var layer = this.layers[idx];
	startY = Math.floor(startY);
	startX = Math.floor(startX);
	for(var r=0; r<this.rows; r++) {
		if((r*this.tile_size)-startY < -1*this.tile_size || (r*this.tile_size)-startY > scrHeight + this.tile_size) continue;
		for(var c=0; c<this.cols; c++) {
			if((c*this.tile_size)-startX < -1*this.tile_size || (c*this.tile_size)-startX > scrWidth + this.tile_size) continue;
				var tile = -1;
				if(layer.length > r && layer[r].length > c) { tile = layer[r][c]; }
				if(tile >= 0) {
					var tile_row = (tile / this.tiles_in_image) | 0;
					var tile_col = (tile % this.tiles_in_image) | 0;
					/* If this tile's normal width would make it go past our scrWidth, make the width smaller. Otherwise, if we're going to draw this tile at a negative x, change the width of the tile as well. If neither case is true, just make it the tile size. */
					var tile_width = ((c*this.tile_size)-startX > scrWidth)? this.tile_size - (((c*this.tile_size)-startX) - scrWidth) : ((c*this.tile_size)-startX < 0)? (c*this.tile_size)-startX+this.tile_size : this.tile_size;
					/* If this tile's normal height would make it go past our scrHeight, make the height smaller. Otherwise, if we're going to draw this tile at a negative y, change the height of the tile as well. If neither case is true, just make it the tile size. */
					var tile_height = ((r*this.tile_size)-startY > scrHeight)? this.tile_size - (((r*this.tile_size)-startY) - scrHeight) : ((r*this.tile_size)-startY < 0)? (r*this.tile_size)-startY+this.tile_size : this.tile_size;
					if(tile_width <= 0 || tile_height <= 0) continue; /* We really don't need to keep going */
					/* Figure out the draw coords. If we were going to draw it at a negative point, make that coord 0 (+draw_x) */
					var tile_draw_x = ((c*this.tile_size)-startX < 0)? 0+draw_x : (c * this.tile_size)-startX+draw_x;
					var tile_draw_y = ((r*this.tile_size)-startY < 0)? 0+draw_y : (r * this.tile_size)-startY+draw_y;
					/* These are the coords of the tile on the tileset image. If we were going to start drawing at a negative point, we need to chop off a bit of the front of the tile */
					var tile_x = (tile_col * (this.tile_size + this.margin)) + (((c*this.tile_size)-startX < 0)? this.tile_size - tile_width : 0);
					var tile_y = (tile_row * (this.tile_size + this.margin)) + (((r*this.tile_size)-startY < 0)? this.tile_size - tile_height : 0);
					
					context.drawImage(this.image, tile_x, tile_y, tile_width, tile_height, tile_draw_x, tile_draw_y, tile_width, tile_height);
			}
		}
	}
}