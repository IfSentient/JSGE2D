var PhysicsObject = SceneObject.extend(function(args) {
	if(args === undefined) args = {};
	SceneObject.prototype.constructor.call(this,args);
	this.visible = (args.visible !== undefined)? args.visible : true;
	this.solid = (args.solid !== undefined)? args.solid : true;
	this.x_acc = (args.xAcceleration !== undefined)? args.xAcceleration : 0;
	this.y_acc = (args.yAcceleration !== undefined)? args.yAcceleration : 0;
	this.x_vel = (args.xVelocity !== undefined)? args.xVelocity : 0;
	this.y_vel = (args.yVelocity !== undefined)? args.yVelocity : 0;
	this.collision_block = (args.collisionBlock !== undefined)? args.collisionBlock : undefined;
	if(!(this.collision_block instanceof CollisionBlock)) this.collision_block = undefined;
	if(this.collision_block !== undefined) {
		this.width = this.collision_block.width;
		this.height = this.collision_block.height;
	}
	this.last_time_step = 0;
});
PhysicsObject.prototype.constructor = PhysicsObject;

PhysicsObject.prototype.setAcceleration = function(args) {
	this.x_acc = (args.xAcceleration !== undefined)? args.xAcceleration : this.x_acc;
	this.y_acc = (args.yAcceleration !== undefined)? args.yAcceleration : this.y_acc;
	this.x_acc = (args.x !== undefined)? args.x : this.x_acc;
	this.y_acc = (args.y !== undefined)? args.y : this.y_acc;
}

PhysicsObject.prototype.setVelocity = function(args) {
	this.x_vel = (args.xVelocity !== undefined)? args.xVelocity : this.x_vel;
	this.y_vel = (args.yVelocity !== undefined)? args.yVelocity : this.y_vel;
	this.x_vel = (args.x !== undefined)? args.x : this.x_vel;
	this.y_vel = (args.y !== undefined)? args.y : this.y_vel;
}

PhysicsObject.prototype.setXAcceleration = function(xAcc) { this.x_acc = xAcc; }
PhysicsObject.prototype.setYAcceleration = function(yAcc) { this.y_acc = yAcc; }
PhysicsObject.prototype.setXVelocity = function(xVel) { this.x_vel = xVel; }
PhysicsObject.prototype.setYVelocity = function(yVel) { this.y_vel = yVel; }

PhysicsObject.prototype.update = function(args) {
	if(args === undefined) args = {};
	var time_step = (args.ms !== undefined)? args.ms : 100;
	time_step = time_step / 1000; /* convert to seconds */
	this.x_vel += this.x_acc * time_step;
	this.y_vel += this.y_acc * time_step;
	this.x += this.x_vel * time_step;
	this.y += this.y_vel * time_step;
	this.last_time_step = time_step;
	for(var i=0; i<this.controllers.length; i++) this.controllers[i].update(args);
};

PhysicsObject.prototype.getCollisionBlock = function() { return this.collision_block; }

PhysicsObject.prototype.isOverlapping = function(sceneObject) {
	if(this.collision_block === undefined) return false;
	return (this.collision_block.isOverlapping({
		collisionBlock: sceneObject.getCollisionBlock(),
		xOffset: sceneObject.x - this.x,
		yOffset: sceneObject.y - this.y
	}));
}

PhysicsObject.prototype.onCollision = function(sceneObject) {
	if(sceneObject.solid) {
		var x_blocked = true;
		var y_blocked = true;
		this.x -= this.x_vel * this.last_time_step;
		this.y -= this.y_vel * this.last_time_step;
		var max_x = this.x_vel * this.last_time_step;
		var max_y = this.y_vel * this.last_time_step;
		/* TODO: implement move-around-obstacle behaviour */
		this.x += max_x;
		if(!this.isOverlapping(sceneObject)) x_blocked = false;
		this.x -= max_x;
		this.y += max_y;
		if(!this.isOverlapping(sceneObject)) y_blocked = false;
		this.y -= max_y;
		
		if(!x_blocked) this.x += max_x;
		else {
			if(max_x > 0) {
				for(var i=max_x; i>0; i--) {
					this.x += i;
					if(!this.isOverlapping(sceneObject)) break;
					this.x -= i;
				}
			}
			else if(max_x < 0) {
				for(var i=max_x; i<0; i++) {
					this.x += i;
					if(!this.isOverlapping(sceneObject)) break;
					this.x -= i;
				}
			}
		}
		if(!y_blocked) this.y += max_y;
		else {
			if(max_y > 0) {
				for(var i=max_y; i>0; i--) {
					this.y += i;
					if(!this.isOverlapping(sceneObject)) break;
					this.y -= i;
				}
			}
			else if(max_y < 0) {
				for(var i=max_y; i<0; i++) {
					this.y += i;
					if(!this.isOverlapping(sceneObject)) break;
					this.y -= i;
				}
			}
		}
		
		if(x_blocked) this.x_vel = 0;
		if(y_blocked) this.y_vel = 0;
	}
}