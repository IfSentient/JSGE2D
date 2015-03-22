var TileObject = SceneObject.extend(function(args) {
	if(args === undefined) args = {};
	SceneObject.prototype.constructor.call(this,args);
	this.collision_block = args.collisionBlock;
	this.solid = true;
});

TileObject.prototype.getCollisionBlock = function() { return this.collision_block; }