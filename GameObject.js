var SceneObject = function(args) {
	if(args === undefined) args = {};
	this.x = (args.x !== undefined)? args.x : 0;
	this.y = (args.y !== undefined)? args.y : 0;
	this.z = (args.z !== undefined)? args.z : 0;
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