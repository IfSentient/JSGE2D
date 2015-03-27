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
	if(debug) {
		//context.fillStyle = "#ff0000";
		//context.fillRect(this.x, this.y, this.collision_block.width, this.collision_block.height);
		this.collision_block.draw({context:context,x:this.x,y:this.y,red:255,alpha:180});
	}
}