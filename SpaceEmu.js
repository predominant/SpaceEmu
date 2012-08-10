/**
 * Player
 * ------------------------------
 */
var Player = function(context) {
	this.context = context;
	this.position = {
		x: 100,
		y: 100,
		layer: 1
	};
	this.fillStyle = 'rgb(255, 255, 255)';
}
Player.prototype.draw = function() {
	this.context.fillStyle = this.fillStyle;
	this.context.beginPath();
	this.context.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2, true);
	this.context.closePath();
	this.context.fill();
};

/**
 * Game
 * ------------------------------
 */
var SpaceEmu = function() {
	this.canvas = null;
	this.context = null;

	this.fallable = [];
	this.collidable = [];
	this.objects = [];
};

SpaceEmu.prototype.initialize = function() {
	this.canvas = document.createElement('canvas');
	this.canvas.width = 640;
	this.canvas.height = 480;

	this.context = this.canvas.getContext('2d');

	document.body.appendChild(this.canvas);

	this.gameSetup();
};

SpaceEmu.prototype.gameSetup = function() {
	var player = new Player(this.context);
	this.objects.push(player);
	this.fallable.push(player);
};

SpaceEmu.prototype.drawLoop = function() {
	requestAnimationFrame(game.drawLoop);
	game.draw();
};

SpaceEmu.prototype.updateLoop = function() {
	game.update();
	setTimeout(game.updateLoop, 1000 / 60);
};

SpaceEmu.prototype.draw = function() {
	this.context.fillStyle = 'rgb(21, 21, 21)';
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	for (var i in this.objects) {
		this.objects[i].draw();
	}
};

SpaceEmu.prototype.update = function() {
	for (var i in this.fallable) {
		this.fallable[i].position.y += 4;
	}
};

(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
 
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}
 
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}

}());

var game = new SpaceEmu();
game.initialize();
game.updateLoop();
game.drawLoop();

