var TileObject = SceneObject.extend(function(args) {
	if(args === undefined) args = {};
	SceneObject.prototype.constructor.call(this,args);
	this.setCollisionBlock(args.collisionBlock);
	this.solid = (args.solid !== undefined)? args.solid : true;
	this.name = (args.name !== undefined)? args.name : 'TileObject'+(~~(Math.random() * 1000000000));
});

TileObject.prototype.getCollisionBlock = function() { return this.collision_block; }

TileObject.prototype.setCollisionBlock = function(cb) {
	if(!(cb instanceof CollisionBlock)) return;
	this.collision_block = cb;
	this.width = cb.width;
	this.height = cb.height;
}

TileObject.prototype.draw = function(args) {
	var context = args.context;
	var debug = args.debug;
	var x_offset = (args.xOffset !== undefined)? args.xOffset : 0;
	var y_offset = (args.yOffset !== undefined)? args.yOffset : 0;
	if(debug) {
		this.collision_block.draw({context:context,x:this.x-x_offset,y:this.y-y_offset,red:255,alpha:180});
	}
}