var SceneObject = function(args) {
	if(args === undefined) args = {};
	this.x = (args.x !== undefined)? args.x : 0;
	this.y = (args.y !== undefined)? args.y : 0;
	this.z = (args.z !== undefined)? args.z : 0;
	this.name = (args.name !== undefined)? args.name : 'SceneObject'+(~~(Math.random() * 1000000000));
	this.width = 0;
	this.height = 0;
	this.solid = false;
	this.visible = false;
	this.controllers = [];
}

SceneObject.prototype.onCollision = function(otherSceneObject) {
	/* No native behaviour */
}

SceneObject.prototype.onEvent = function(args) {
	/* No native behaviour */
}

SceneObject.prototype.update = function(args) {
	/* No native behaviour */
}

SceneObject.prototype.draw = function(args) {
	/* No native behaviour */
}

SceneObject.prototype.isOverlapping = function(sceneObject) {
	return false;
}

SceneObject.prototype.getCollisionBlock = function() { return undefined; }

SceneObject.prototype.addController = function(controller) {
	this.controllers[this.controllers.length] = controller;
	controller.setSceneObject(this);
}