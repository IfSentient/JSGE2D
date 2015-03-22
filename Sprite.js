var Sprite = function(args) {
	this.image = new Image();
	this.image.src = (args.src !== undefined)? args.src : '';
	this.states = [];
	this.current_state = undefined;
	this.return_to_state = undefined;
	this.frame_counter = 0;
	this.update_counter = 0;
	this.anim_speed_override = 0;
	this.animate = true;
}

Sprite.prototype.addAnimation = function(args) {
	var startY = (args.startY !== undefined)? args.startY : 0;
	var startX = (args.startX !== undefined)? args.startX : 0;
	var sprWidth = (args.width !== undefined)? args.width : 16;
	var sprHeight = (args.height !== undefined)? args.height : 16;
	var sprPadding = (args.padding !== undefined)? args.padding : 0;
	var numFrames = (args.frames !== undefined)? args.frames : 2;
	var animSpeed = (args.speed !== undefined)? args.speed : 10;
	var state = (args.name !== undefined)? args.name : 'default';
	this.states[state] = { 
		start_x : startX,
		start_y : startY,
		width : sprWidth,
		height : sprHeight,
		padding : sprPadding,
		frames : numFrames,
		speed : animSpeed,
		animate : true
	};
}

Sprite.prototype.addStill = function(args) {
	var startY = (args.startY !== undefined)? args.startY : 0;
	var startX = (args.startX !== undefined)? args.startX : 0;
	var sprWidth = (args.width !== undefined)? args.width : 16;
	var sprHeight = (args.height !== undefined)? args.height : 16;
	var state = (args.name !== undefined)? args.name : 'default';
	this.states[state] = { 
		start_x : startX,
		start_y : startY,
		width : sprWidth,
		height : sprHeight,
		padding : 0,
		frames : 1,
		speed : 1,
		animate : false
	};
}

Sprite.prototype.setState = function(args) {
	var state = (args.state !== undefined)? args.state : 'default';
	if(this.states[state] === undefined) return;
	var loop = (args.loop !== undefined)? args.loop : true;
	if(loop) this.return_to_state = undefined;
	else this.return_to_state = (args.nextState !== undefined)? args.nextState : this.current_state;
	this.current_state = state;
	this.anim_speed_override = 0;
}

Sprite.prototype.getState = function() { return this.current_state; }

Sprite.prototype.pauseAnimation = function() { this.animate = false; }

Sprite.prototype.resumeAnimation = function() { this.animate = true; }

Sprite.prototype.setAnimationSpeed = function(speed) {
	anim_speed_override = speed;
}

Sprite.prototype.update = function(args) {
	if(this.current_state !== undefined) {
		var state = this.states[this.current_state];
		if(state.animate && this.animate) {
			if(this.update_counter > state.speed) {
				this.frame_counter++;
				this.update_counter = 0;
				if(this.frame_counter >= state.frames) {
					this.frame_counter = 0;
					if(this.return_to_state !== undefined) this.setState({state:this.return_to_state});
				}
			}
			this.update_counter++;
		}
	}
}

Sprite.prototype.draw = function(args) {
	var context = args.context;
	var draw_x = args.x;
	var draw_y = args.y;
	var state = this.states[this.current_state];
	if(context === undefined || draw_x === undefined || draw_y === undefined || state === undefined) return;
	context.drawImage(this.image, state.start_x+(this.frame_counter*(state.width+state.padding)), state.start_y, state.width, state.height, draw_x, draw_y, state.width, state.height);
}