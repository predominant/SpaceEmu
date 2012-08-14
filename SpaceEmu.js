/**
 * Player
 * ------------------------------
 */
var Player = function(context, sprites, x, y) {
	this.gravity = true;
	this.collidable = true;
	this.context = context;
	this.x = x;
	this.y = y;
	this.width = 30;
	this.height = 30;
	this.fillStyle = '#fff';
	this.sprites = sprites;
	this.velocity = {
		x: 0,
		y: 0
	};
};
Player.prototype.draw = function() {
	this.context.drawImage(this.sprites, 0, 16, 16, 16, this.x, this.y, this.width, this.height);
};
Player.prototype.update = function() {

};
Player.prototype.flap = function() {
	this.velocity.y -= game.gravity * 2;
};

/**
 * Platform
 * ------------------------------
 */
var Platform = function(context, x, y, width, height) {
	this.gravity = false;
	this.collidable = true;
	this.context = context;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.fillStyle = '#fff';
};
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
	//this.platforms = [];
	
	this.fallable = [];
	this.collidable = [];
	this.objects = [];

	this.spriteFile = 'Sprites.png';
	this.sprites = new Image();
	this.sprites.src = this.spriteFile;

	this.gravity = 16;
	this.deltaTime = 0;
	this.lastUpdate = new Date().getMilliseconds();
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
	this.player = new Player(this.context, this.sprites, 100, 50);
	this.addObject(this.player);

	var p2 = new Player(this.context, this.sprites, 390, 50);
	this.addObject(p2);


	this.createPlatform(-50, 130, 100, 7);
	this.createPlatform(550, 130, 200, 7);
	this.createPlatform(220, 150, 150, 7);

	this.createPlatform(250, 300, 110, 7);

	this.createPlatform(-50, 280, 160, 7);
	this.createPlatform(550, 280, 150, 7);
	this.createPlatform(450, 250, 110, 7);

	this.createPlatform(-50, 420, 700, 7);
};

SpaceEmu.prototype.createPlatform = function(x, y, width, height) {
	var p = new Platform(this.context, x, y, width, height);
	//this.platforms.push(p);
	this.addObject(p);
};

SpaceEmu.prototype.addObject = function(o) {
	this.objects.push(o);
	if (o.gravity) {
		this.fallable.push(o);
	}
	if (o.collidable) {
		this.collidable.push(o);
	}
};

SpaceEmu.prototype.drawLoop = function() {
	requestAnimationFrame(game.drawLoop);
	game.draw();
};

SpaceEmu.prototype.updateLoop = function() {
	var d = new Date();
	this.deltaTime = (d.getMilliseconds() - this.lastUpdate) / 1000;
	game.update();
	setTimeout(game.updateLoop, 1000 / 60);
};

SpaceEmu.prototype.draw = function() {
	this.context.fillStyle = '#111';
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	for (var i in this.objects) {
		this.objects[i].draw();
	}
};

SpaceEmu.prototype.update = function() {
	for (var i in this.fallable) {
		this.fallable[i].velocity.y += this.gravity * game.deltaTime;
		this.fallable[i].x += 1;
		this.fallable[i].y += this.fallable[i].velocity.y;

		for (var j in this.collidable) {
			var collider = this.collidable[j];

			// If collision of bottom edge of the player with top edge of a platform
			if (this.fallable[i].y + this.fallable[i].height > collider.y &&
				this.fallable[i].y + this.fallable[i].height < collider.y + collider.height &&
				this.fallable[i].x + this.fallable[i].width > collider.x &&
				this.fallable[i].x < collider.x + collider.width) {

				this.fallable[i].y = collider.y - this.fallable[i].height;
				this.fallable[i].velocity.y = 0;
			}
		}
	}

	for (var i in this.fallable) {
		if (this.fallable[i].x > this.canvas.width) {
			this.fallable[i].x = -this.fallable[i].width;
		}
		if (this.fallable[i].x < -this.fallable[i].width) {
			this.fallable[i].x = this.canvas.width;
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

