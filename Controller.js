var Controller = function(args) {
	if(args === undefined) args = {};
	this.scene_object = (args.sceneObject !== undefined)? args.sceneObject : undefined;
	this.active = true;
}

Controller.prototype.setSceneObject = function(so) {
	this.scene_object = so;
}

Controller.prototype.handleEvent = function(args) {
	/* Stub method, must be expanded in extending class */
}

Controller.prototype.update = function(args) {
	/* Stub method, must be expanded in extending class */
}