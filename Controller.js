var Controller = function(args) {
	this.scene_object = (args.sceneObject !== undefined)? args.sceneObject : undefined;
}

Controller.prototype.setSceneObject = function(so) {
	this.scene_object = so;
}

Controller.prototype.update = function(args) {
	/* Stub method, must be expanded in extending class */
}