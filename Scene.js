var Scene = function(args) {
	this.width = (args.width !== undefined)? args.width : 100;
	this.height = (args.height !== undefined)? args.height : 100;
	this.tileset = (args.tileset !== undefined)? args.tileset : undefined;
	if(!(this.tileset instanceof TileSet)) this.tileset = undefined;
	this.scene_objects = [];
	this.scene_observers = [];
	this.scene_viewports = [];
	this.bg_color = '#ffffff';
	this.debug = false;
};

Scene.prototype.addSceneObject = function(sceneObject) {
	if(!(sceneObject instanceof SceneObject)) return;
	var inserted = false;
	for(var i=0; i<this.scene_objects.length; i++) {
		if(this.scene_objects[i].z > sceneObject.z) { this.scene_objects.splice(i,0,sceneObject); inserted = true; }
	}
	if(!inserted) this.scene_objects[this.scene_objects.length] = sceneObject;
}

Scene.prototype.addObserver = function(sceneObserver) {
	if(!(sceneObserver instanceof SceneObserver)) return;
	this.scene_observers[this.scene_observers.length] = sceneObserver;
}

Scene.prototype.addViewport = function(viewport) {
	if(!(viewport instanceof Viewport)) return;
	this.scene_viewports[this.scene_viewports.length] = viewport;
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
	for(var i=0; i<this.scene_viewports.length; i++) {
		this.scene_viewports[i].update();
	}
}

Scene.prototype.draw = function(args) {
	var context = args.context;
	if(context === undefined) return;
	
	context.globalCompositeOperation = "source-over";
	context.fillStyle = this.bg_color;
	context.fillRect(0, 0, W, H);
	
	for(var i=0; i<this.scene_viewports.length; i++) {
		var xoff = this.scene_viewports[i].x;
		var yoff = this.scene_viewports[i].y;
		var tswidth = this.scene_viewports[i].width;
		var tsheight = this.scene_viewports[i].height;
		var dx = this.scene_viewports[i].draw_x;
		var dy = this.scene_viewports[i].draw_y;
		if(this.tileset !== undefined) {
			for(var i=0; i<this.tileset.getZLayers().length; i++) {
				for(var j=0; j<this.scene_objects.length; j++) if(this.scene_objects[j].z < this.tileset.getZLayers()[i]) { 
					/* TODO: only draw objects within the viewport */
					this.scene_objects[j].draw({context:context,xOffset:xoff-dx,yOffset:yoff-dy,debug:this.debug});
				}
				this.tileset.drawLayer({zIndex:this.tileset.getZLayers()[i],context:context,width:tswidth,height:tsheight,startX:xoff,startY:yoff,drawX:dx,drawY:dy});
			}
			for(var j=0; j<this.scene_objects.length; j++) {
				/* TODO: only draw objects within the viewport */
				if(this.scene_objects[j].z >= this.tileset.getZLayers()[this.tileset.getZLayers().length-1]) 
					this.scene_objects[j].draw({context:context,xOffset:xoff-dx,yOffset:yoff-dy,debug:this.debug});
			}
		} else {
			for(var i=0; i<this.scene_objects.length; i++) {
				/* TODO: only draw objects within the viewport */
				this.scene_objects[i].draw({context:context,xOffset:xoff,yOffset:yoff,debug:this.debug});
			}
		}
	}
}