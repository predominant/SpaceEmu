/**
 * Player
 * ------------------------------
 */
var Player = function(context, x, y) {
	this.context = context;
	this.x = x;
	this.y = y;
	this.radius = 20;
	this.fillStyle = '#fff';
}
Player.prototype.draw = function() {
	this.context.fillStyle = this.fillStyle;
	this.context.beginPath();
	this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
	this.context.closePath();
	this.context.fill();
};

/**
 * Platform
 * ------------------------------
 */
var Platform = function(context, x, y, width, height) {
	this.context = context;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.fillStyle = '#fff';
}
Platform.prototype.draw = function() {
	this.context.fillStyle = this.fillStyle;
	this.context.fillRect(this.x, this.y, this.width, this.height);
};

/**
 * Game
 * ------------------------------
 */
var SpaceEmu = function() {
	this.canvas = null;
	this.context = null;

	this.player = null;
	this.platforms = [];
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
	this.player = new Player(this.context, 100, 50);

	this.platforms.push(new Platform(this.context, 50, 130, 200, 20));
	this.platforms.push(new Platform(this.context, 380, 130, 200, 20));
	this.platforms.push(new Platform(this.context, 50, 280, 200, 20));
	this.platforms.push(new Platform(this.context, 380, 280, 200, 20));
	this.platforms.push(new Platform(this.context, 0, 420, 640, 20));
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
	this.context.fillStyle = '#111';
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	for (var i = 0; i < this.platforms.length; i++) {
		this.platforms[i].draw();
	}

	this.player.draw();
};

SpaceEmu.prototype.update = function() {
	this.player.x += 1;
	this.player.y += 4;

	for (var i = 0; i < this.platforms.length; i++) {
		var platform = this.platforms[i];

		// If collision of bottom edge of the player with top edge of a platform
		if (this.player.y + this.player.radius > platform.y &&
			this.player.y + this.player.radius < platform.y + platform.height &&
			this.player.x + this.player.radius > platform.x &&
			this.player.x - this.player.radius < platform.x + platform.width) {

			this.player.y = platform.y - this.player.radius;
		}
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

