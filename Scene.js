var Scene = function(args) {
	this.width = (args.width !== undefined)? args.width : 100;
	this.height = (args.height !== undefined)? args.height : 100;
	this.tileset = (args.tileset !== undefined)? args.tileset : undefined;
	if(!(this.tileset instanceof TileSet)) this.tileset = undefined;
	this.scene_objects = [];
	this.scene_observers = [];
	this.bg_color = '#ffffff';
	this.debug = false;
};

Scene.prototype.setTileset = function(ts) {
	if(ts instanceof TileSet) this.tileset = ts;
}

Scene.prototype.addSceneObject = function(sceneObject) {
	if(!(sceneObject instanceof SceneObject)) return;
	var inserted = false;
	for(var i=0; i<this.scene_objects.length; i++) {
		if(this.scene_objects[i].z > sceneObject.z) { this.scene_objects.splice(i,0,sceneObject); inserted = true; }
	}
	if(!inserted) this.scene_objects[this.scene_objects.length] = sceneObject;
}

Scene.prototype.removeSceneObject = function(sceneObjectName) {
	for(var i=0; i<this.scene_objects.length; i++) {
		if(this.scene_objects[i].name === sceneObjectName) { this.scene_objects.splice(i,1); return; }
	}
}

Scene.prototype.addObserver = function(sceneObserver) {
	if(!(sceneObserver instanceof SceneObserver)) return;
	this.scene_observers[this.scene_observers.length] = sceneObserver;
}

Scene.prototype.setBackgroundColor = function(color) {
	this.bg_color = color;
}

Scene.prototype.update = function(args) {
	for(var i=0; i<this.scene_objects.length; i++) { 
		this.scene_objects[i].update(args);
	}
	for(var i=0; i<this.scene_observers.length; i++) {
		this.scene_observers[i].update();
	}
	/*for(var i=0; i<this.scene_viewports.length; i++) {
		this.scene_viewports[i].update();
	}*/
}

Scene.prototype.draw = function(args) {
	var context = args.context;
	if(context === undefined) return;
	
	var xoff = (args.x !== undefined)? args.x : 0;
	var yoff = (args.y !== undefined)? args.y : 0;
	var vwidth = (args.width !== undefined)? args.width : this.width;
	var vheight = (args.height !== undefined)? args.height : this.height;
	var dx = (args.drawX !== undefined)? args.drawX : 0;
	var dy = (args.drawY !== undefined)? args.drawY : 0;
	
	context.globalCompositeOperation = "source-over";
	context.fillStyle = this.bg_color;
	context.fillRect(dx, dy, vwidth, vheight);
	
	if(this.tileset !== undefined) {
		for(var j=0; j<this.tileset.getZLayers().length; j++) {
			for(var k=0; k<this.scene_objects.length; k++) if(this.scene_objects[k].z < this.tileset.getZLayers()[j]) { 
				var so = this.scene_objects[k];
				if(so.x + so.width < xoff || so.x > xoff+vwidth || so.y + so.height < yoff || so.y > yoff+vheight) continue;
				so.draw({context:context,xOffset:xoff-dx,yOffset:yoff-dy,debug:this.debug});
			}
			this.tileset.drawLayer({zIndex:this.tileset.getZLayers()[j],context:context,width:vwidth,height:vheight,startX:xoff,startY:yoff,drawX:dx,drawY:dy});
		}
		for(var j=0; j<this.scene_objects.length; j++) {
			var so = this.scene_objects[j];
			if(so.x + so.width < xoff || so.x > xoff+vwidth || so.y + so.height < yoff || so.y > yoff+vheight) continue;
			if(so.z >= this.tileset.getZLayers()[this.tileset.getZLayers().length-1]) 
					so.draw({context:context,xOffset:xoff-dx,yOffset:yoff-dy,debug:this.debug});
		}
	} else {
		for(var i=0; i<this.scene_objects.length; i++) {
			var so = this.scene_objects[i];
			if(so.x + so.width < xoff || so.x > xoff+vwidth || so.y + so.height < yoff || so.y > yoff+vheight) continue;
				so.draw({context:context,xOffset:xoff-dx,yOffset:yoff-dy,debug:this.debug});
		}
	}
	
	/*for(var i=0; i<this.scene_viewports.length; i++) {
		var xoff = this.scene_viewports[i].x;
		var yoff = this.scene_viewports[i].y;
		var vwidth = this.scene_viewports[i].width;
		var vheight = this.scene_viewports[i].height;
		var dx = this.scene_viewports[i].draw_x;
		var dy = this.scene_viewports[i].draw_y;
		if(this.debug) { 
			context.beginPath();
			context.rect(dx,dy,vwidth,vheight);
			context.stroke();
			context.fillStyle = '#0000ff';
			context.fillText('Viewport '+i+' (Target: '+((this.scene_viewports[i].target !== undefined)? this.scene_viewports[i].target.name : 'None')+')',dx+5,dy+15);
		}
		if(this.tileset !== undefined) {
			for(var j=0; j<this.tileset.getZLayers().length; j++) {
				for(var k=0; k<this.scene_objects.length; k++) if(this.scene_objects[k].z < this.tileset.getZLayers()[j]) { 
					
					var so = this.scene_objects[k];
					if(so.x + so.width < xoff || so.x > xoff+vwidth || so.y + so.height < yoff || so.y > yoff+vheight) continue;
					so.draw({context:context,xOffset:xoff-dx,yOffset:yoff-dy,debug:this.debug});
				}
				this.tileset.drawLayer({zIndex:this.tileset.getZLayers()[j],context:context,width:vwidth,height:vheight,startX:xoff,startY:yoff,drawX:dx,drawY:dy});
			}
			for(var j=0; j<this.scene_objects.length; j++) {
				
					var so = this.scene_objects[j];
					if(so.x + so.width < xoff || so.x > xoff+vwidth || so.y + so.height < yoff || so.y > yoff+vheight) continue;
				if(so.z >= this.tileset.getZLayers()[this.tileset.getZLayers().length-1]) 
					so.draw({context:context,xOffset:xoff-dx,yOffset:yoff-dy,debug:this.debug});
			}
		} else {
			for(var i=0; i<this.scene_objects.length; i++) {
				
				this.scene_objects[i].draw({context:context,xOffset:xoff,yOffset:yoff,debug:this.debug});
			}
		}
	}*/
}