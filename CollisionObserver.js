var CollisionObserver = SceneObserver.extend(function(args) {
	SceneObserver.prototype.constructor.call(this,args);
});

CollisionObserver.prototype.update = function() {
	for(var i=0; i<this.scene_objects.length; i++) {
		var so = this.scene_objects[i];
		for(var j=0; j<this.scene_objects.length; j++) {
			if(i == j) continue;
			if(so.isOverlapping(this.scene_objects[j])) so.onCollision(this.scene_objects[j]);
		}
	}
}