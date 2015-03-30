var TileObject = SceneObject.extend(function(args) {
	if(args === undefined) args = {};
	SceneObject.prototype.constructor.call(this,args);
	this.collision_block = args.collisionBlock;
	this.solid = true;
});

TileObject.prototype.getCollisionBlock = function() { return this.collision_block; }

TileObject.prototype.draw = function(args) {
	var context = args.context;
	var debug = args.debug;
	var x_offset = (args.xOffset !== undefined)? args.xOffset : 0;
	var y_offset = (args.yOffset !== undefined)? args.yOffset : 0;
	if(debug) {
		this.collision_block.draw({context:context,x:this.x-x_offset,y:this.y-y_offset,red:255,alpha:180});
	}
}