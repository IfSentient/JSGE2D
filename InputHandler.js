var InputHandler = function() {
	this.controllers = [];
}

InputHandler.prototype.keyDown = function(event) {
	this.handleInput({type:'keydown','event':event});
}

InputHandler.prototype.keyUp = function(event) {
	this.handleInput({type:'keyup','event':event});
}

InputHandler.prototype.mouseDown = function(event) {
	this.handleInput({type:'mousedown','event':event});
}

InputHandler.prototype.mouseUp = function(event) {
	this.handleInput({type:'mouseup','event':event});
}

InputHandler.prototype.mouseMove = function(event) {
	this.handleInput({type:'mousemove','event':event});
}

InputHandler.prototype.handleInput = function(args) {
	if(args.type === undefined || args.event === undefined) return;
	for(var i=0; i<this.controllers.length; i++) this.controllers[i].handleEvent(args);
}

InputHandler.prototype.registerController = function(controller) {
	this.controllers[this.controllers.length] = controller;
}