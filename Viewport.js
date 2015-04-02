var Viewport = function(args) {
	if(args === undefined) args = {};
	this.width = (args.width !== undefined)? args.width : 1280;
	this.height = (args.height !== undefined)? args.height : 720;
	this.x = (args.x !== undefined)? args.x : 0;
	this.y = (args.y !== undefined)? args.y : 0;
	this.draw_x = (args.drawX !== undefined)? args.drawX : 0;
	this.draw_y = (args.drawY !== undefined)? args.drawY : 0;
	this.x_move_buffer = (args.xBuffer !== undefined)? args.xBuffer : Math.floor(this.width/3);
	this.y_move_buffer = (args.yBuffer !== undefined)? args.yBuffer : Math.floor(this.height/3);
	this.target = args.target;
	this.scenes = [];
	this.current_scene = undefined;
}

Viewport.prototype.loadScene = function(args) {
	if(args === undefined) return;
	var scene_name = (args.name !== undefined)? args.name : 'default';
	var scene = (args.scene !== undefined)? args.scene : undefined;
	if(scene !== undefined && scene instanceof Scene) {
		this.scenes[scene_name] = scene;
	}
}

Viewport.prototype.unloadScene = function(sceneName) {
	this.scenes[sceneName] = undefined;
}

Viewport.prototype.setCurrentScene = function(args) {
	if(args === undefined) return;
	var scene_name = (args.name !== undefined)? args.name : 'default';
	if(this.scenes[scene_name] !== undefined) this.current_scene = this.scenes[scene_name];
}

Viewport.prototype.getCurrentScene = function() {
	return this.current_scene;
}

Viewport.prototype.setTarget = function(args) {
	this.x_move_buffer = (args.xBuffer !== undefined)? args.xBuffer : this.x_move_buffer;
	this.y_move_buffer = (args.yBuffer !== undefined)? args.yBuffer : this.y_move_buffer;
	this.target = args.target;
}

Viewport.prototype.center = function() {
	if(this.target === undefined) return;
	this.x = (this.target.x + Math.floor(this.target.width/2)) - Math.floor(this.width / 2);
	this.y = (this.target.y + Math.floor(this.target.height/2)) - Math.floor(this.height / 2);
}

Viewport.prototype.update = function() {
	if(this.target !== undefined) {
		var x_mid = Math.floor(this.target.width / 2);
		var y_mid = Math.floor(this.target.height / 2);
		if(this.target.x + x_mid < this.x + this.x_move_buffer) this.x = this.target.x + x_mid - this.x_move_buffer;
		else if(this.target.x + x_mid > this.x + this.width - this.x_move_buffer) this.x = (this.target.x + x_mid - this.width) + this.x_move_buffer;
		if(this.target.y + y_mid < this.y + this.y_move_buffer) this.y = this.target.y + y_mid - this.y_move_buffer;
		else if(this.target.y + y_mid > this.y + this.height - this.y_move_buffer) this.y = (this.target.y + y_mid - this.height) + this.y_move_buffer;
	}
}

Viewport.prototype.draw = function(args) {
	if(args === undefined) return;
	var context = args.context;
	if(this.current_scene !== undefined) this.current_scene.draw({
		context: context,
		x: this.x,
		y: this.y,
		width: this.width,
		height: this.height,
		drawX: this.draw_x,
		drawY: this.draw_y
	});
}