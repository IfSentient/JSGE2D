var SceneObserver = function(args) {
	this.scene_objects = [];
}

SceneObserver.prototype.registerObject = function(sceneObject) {
	this.scene_objects[this.scene_objects.length] = sceneObject;
}

SceneObserver.prototype.deregisterObject = function(sceneObject) {
	for(var i=0; i<this.scene_objects.length; i++) {
		if(this.scene_objects[i] === sceneObject) {
			this.scene_objects.splice(i,1);
			break;
		}
	}
}

SceneObserver.prototype.update = function() {
	/* No native behaviour */
}