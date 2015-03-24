var Actor = PhysicsObject.extend(function(args) {
	PhysicsObject.prototype.constructor.call(this,args); /* First call to PhysicsObject's constructor, then do Actor-specific behaviour */
	this.sprite = (args.sprite !== undefined)? args.sprite : undefined; /* Actors all have sprites--they are visible objects that exist in the world. */
	if(!(this.sprite instanceof Sprite)) this.sprite = undefined;
	this.states = [];
	this.current_state = undefined;
});

Actor.prototype.addState = function(args) {
	var stateName = (args.name !== undefined)? args.name : 'default';
	var stateSprite = (args.spriteState !== undefined)? args.spriteState : undefined;
	var statePauseSprite = (args.spritePause !== undefined)? args.spritePause : false;
	var stateXAcc = (args.xAcceleration !== undefined)? args.xAcceleration : 0;
	var stateYAcc = (args.yAcceleration !== undefined)? args.yAcceleration : 0;
	var stateXVel = (args.xVelocity !== undefined)? args.xVelocity : 0;
	var stateYVel = (args.yVelocity !== undefined)? args.yVelocity : 0;
	var stateCollisionBox = (args.collisionBox !== undefined)? args.collisionBox : this.collision_box;
	this.states[stateName] = {
		sprite : stateSprite,
		pause_sprite : statePauseSprite,
		x_acc : stateXAcc,
		y_acc : stateYAcc,
		x_vel : stateXVel,
		y_vel : stateYVel,
		collision_box : stateCollisionBox
	}
}

Actor.prototype.setState = function(newState) {
	if(this.states[newState] === undefined) return;
	if(this.current_state !== undefined) {
		this.x_acc -= this.states[this.current_state].x_acc;
		this.y_acc -= this.states[this.current_state].y_acc;
	}
	if(this.states[newState].sprite !== undefined) this.sprite.setState(this.states[newState].sprite);
	if(this.states[newState].pause_sprite) this.sprite.pauseAnimation();
	else this.sprite.resumeAnimation();
	this.collision_box = this.states[newState].collision_box;
	this.x_acc += this.states[newState].x_acc;
	this.y_acc += this.states[newState].y_acc;
	this.x_vel += this.states[newState].x_vel;
	this.y_vel += this.states[newState].y_vel;
	this.current_state = newState;
}

Actor.prototype.getState = function() { return this.current_state; };

Actor.prototype.update = function(args) {
	this.parent.update.apply(this, args);
	if(this.sprite !== undefined) this.sprite.update();
}

Actor.prototype.draw = function(args) {
	var context = args.context;
	var x_offset = (args.xOffset !== undefined)? args.xOffset : 0;
	var y_offset = (args.yOffset !== undefined)? args.yOffset : 0;
	if(context === undefined) return;
	
	if(args.debug) {
		context.fillStyle = "#00ff00";
		context.fillRect(this.x, this.y, this.collision_block.width, this.collision_block.height);
	}
	this.sprite.draw({'context':context,x:this.x-x_offset,y:this.y-y_offset});
}