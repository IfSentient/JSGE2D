var InputController = Controller.extend(function(args) {
	Controller.prototype.constructor.call(this,args);
	this.key_down_events = [];
	this.key_up_events = [];
	this.state_object = {};
});

InputController.prototype.setInputHandler = function(inputHandler) {
	inputHandler.registerController(this);
}

InputController.prototype.handleEvent = function(args) {
	if(args === undefined) return;
	if(args.type === 'keydown' && this.key_down_events[args.event.keyCode] !== undefined) 
		this.key_down_events[args.event.keyCode]({
			'event':args.event,
			object: this.scene_object,
			stateObject: this.state_object
		});
	else if(args.type === 'keyup' && this.key_up_events[args.event.keyCode] !== undefined) 
		this.key_up_events[args.event.keyCode]({
			'event':args.event,
			object: this.scene_object,
			stateObject: this.state_object
		});
}

InputController.prototype.addInputBinding = function(args) {
	if(args === undefined) return;
	var inputType = args.type;
	var inputKeyCode = args.keyCode;
	var inputAction = args.action;
	if(inputType === undefined || inputAction === undefined) return;
	if((inputType === 'keydown' || inputType === 'keyup') && inputKeyCode === undefined) return;
	if(inputType === 'keydown') this.key_down_events[inputKeyCode] = inputAction; 
	else if(inputType === 'keyup') this.key_up_events[inputKeyCode] = inputAction; 
}

InputController.prototype.update = function(args) {
	if(this.active) {
		if(this.state_object.update !== undefined) this.state_object.update({
			object: this.scene_object,
			stateObject: this.state_object
		});
	}
}