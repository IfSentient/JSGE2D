Object.prototype.extend = function(constructor) {
    var child = undefined;
    if(typeof constructor === 'function') 
    {
    	child = constructor;
    	child.prototype.constructor = child;
    } else { 
    	child = function() { this.constructor.apply(this, arguments); };
		child.prototype.constructor = this.constructor; 
    }
    child.prototype = new this;
    child.prototype.parent = this.prototype;
    return child;
} 