var SceneObject = function(args) {
	if(args === undefined) args = {};
	this.x = (args.x !== undefined)? args.x : 0;
	this.y = (args.y !== undefined)? args.y : 0;
	this.z = (args.z !== undefined)? args.z : 0;
	this.width = 0;
	this.height = 0;
	this.solid = false;
	this.visible = false;
	this.controller = undefined;
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

SceneObject.prototype.setController = function(c) {
	this.controller = c;
}