// Global variables required for the game
var game;
var player = null;
var allEnemies = null;
var collectables = null;

/**
 * The Game object has contains the functions to handle the main menu, game over menu,
 * collision detection algorithm used in the game and other functions required to start
 * the game.
 * A new Game object is created and assigned to the game variable in the Engine.reset()
 * function and the game.main() function is invoked to load the main menu.
 */
var Game = function Game() {
	this.canvasWidth = ctx.canvas.width;
	this.canvasHeight = ctx.canvas.height;
	this.mainMenuClass = ".main-menu";
	this.gameOverMenuClass = ".game-over-menu";
	this.maxEnemies = 4;
	this.scoreboard = new Scoreboard();
	this.thrownRocks = [];
};

Game.prototype = {
	/**
	 * Show's the main menu and starts the game when the user selects a character.
	 */
	mainMenu: function() {
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		var mainMenuDiv = document.querySelector(".main-menu");
		mainMenuDiv.style.display = "block";
		var mainMenuDivChildren = mainMenuDiv.children;
		var child;
		for (var i = 0; i < mainMenuDivChildren.length; i++) {
			 child = mainMenuDivChildren[i];
			if (child.nodeName == "BUTTON") {
				child.addEventListener("click", function(e) {
					game.hideMainMenu();
					game.start(this.firstElementChild.getAttribute("src"));
				}, false);
			}
		}
	},
	/**
	 * Draw's the game over menu and allows the user to restart or return to the
	 * main menu.
	 */
	gameOver: function() {
		ctx.shadowColor = "black";
		ctx.shadowOffsetX = 10;
		ctx.shadowOffsetY = 10;
		ctx.shadowBlur = 10;
		ctx.fillStyle = "#812807";
		ctx.fillRect(40, 200, this.canvasWidth - 80, this.canvasHeight - 400);

		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.font = "48px serif";
		ctx.fillText("Game Over!", 140, 290);
		ctx.fillStyle = "#C73E0B";
		ctx.fillText("Game Over!", 140, 290);

		var gameOverDiv = document.createElement("div");
		gameOverDiv.style.display = "block";
		gameOverDiv.style.position = "relative";
		gameOverDiv.style.top = "-260px";
		gameOverDiv.style.left = "5px";
		gameOverDiv.classList.add(this.gameOverMenuClass.slice(1));

		var restartBtn = document.createElement("button");
		restartBtn.innerHTML = "Restart"
		restartBtn.style.marginRight = "50px";
		restartBtn.style.height = "35px";
		restartBtn.style.background = "#C73E0B"
		restartBtn.style.color = "#FFF";

		var mainMenuBtn = document.createElement('button');
		mainMenuBtn.innerHTML = "Main Menu"
		mainMenuBtn.style.marginLeft = "50px";
		mainMenuBtn.style.height = "35px";
		mainMenuBtn.style.background = "#C73E0B";
		mainMenuBtn.style.color = "#FFF";

		restartBtn.addEventListener('click', function() {
			game.removeGameOverMenu();
			game.start(player.sprite);
		});
		mainMenuBtn.addEventListener('click', function() {
			game.removeGameOverMenu();
			game.mainMenu();
		});

		gameOverDiv.appendChild(restartBtn);
		gameOverDiv.appendChild(mainMenuBtn);
		document.body.appendChild(gameOverDiv);
	},
	/**
	 * Hide's the main menu
	 */
	hideMainMenu: function() {
		document.querySelector(this.mainMenuClass).style.display = "none";
	},
	/**
	 * Removes the game over menu.
	 */
	removeGameOverMenu: function() {
		this.scoreboard.hide();
		document.body.removeChild(document.querySelector(this.gameOverMenuClass));
	},
	/**
	 * A simple collision detection algorithm used in the game.
	 * The algorithm checks whether to two entities overlap by comparing their position
	 * and positions plus their widths.
	 *
	 * @param  Player, Enemy or Collectible object
	 * @param  Player, Enemy or Collectible object
	 * @return true if the two objects have collided.
	 */
	hasCollided: function(a, b) {
		return a.x < b.x + b.width && a.x + a.width > b.x
			&& a.y < b.y + b.height && a.y + a.width > b.y;
	},

	/**
	 * Load and reset the scoreboard, load the enemies and the collectibles and create the
	 * player.
	 *
	 * @param {string} playerSprite the path to the sprite belonging to the character chosen
	 *                             from the main menu
	 */
	start: function(playerSprite) {
		player = new Player(playerSprite);
		this.scoreboard.show();
		this.scoreboard.reset();
		this.thrownRocks = [];
		allEnemies = this.getEnemies();
		collectables = this.getCollectables();
	},

	/**
	 * Return an array containing enemies.
	 * The enemy positions and speeds are assigned randomly. The x and y cordinates for the
	 * positions are read randomly from the yCordinates and xCordinates arrays.
	 * Enemies are also assigned such that they are distributed evenly on each row.
	 * The total number of enemies can be controlled by changing the maxEnemies variable in the
	 * Game constructor.
	 *
	 * @return {array} containing the enemies.
	 */
	getEnemies: function() {
		var enemies = [];
		var yCordinates = [60, 145, 230];
		var yEnemyMax = Math.ceil(this.maxEnemies/3);
		var yEnemyCounter = [0, 0, 0];
		var xCordinates = [1, 200, 400];
		var totalEnemies = 0;

		while (totalEnemies <= this.maxEnemies) {
			var dtMultiplier = Math.ceil(Math.random()*300 + 100);
			var yIndex = Math.ceil(Math.random()*3) - 1;
			var yStart = yCordinates[yIndex];
			var xStart = xCordinates[Math.ceil(Math.random()*3) - 1];
			if (yEnemyCounter[yIndex] < yEnemyMax) {
				enemies.push(new Enemy(xStart, yStart, dtMultiplier));
				yEnemyCounter[yIndex]++;
				totalEnemies = yEnemyCounter[0] + yEnemyCounter[1] + yEnemyCounter[2];
			}
		}
		return enemies;
	},
	/**
	 * Create and assign the locations for collectable items. The x and y cordinates for the
	 * positions are read randomly from the yCordinates and xCordinates arrays, similar to the
	 * method used to determine Enemy positions in getEnemies().
	 * A player can get a maximum of 5 lives and 10 stones.
	 *
	 * @return {array} of collectable items
	 */
	getCollectables: function() {
		var collectables = [];
		var yCordinates = [100, 185, 270];
		var xCordinates = [20, 120, 220, 320, 420];
		var maxGems = 2, numGems = 0;
		var maxHearts = 1, numHearts = 0;
		var maxRocks = 2, numRocks = 0;
		var maxCollectables = maxGems + maxHearts + maxRocks;
		var xStart, yStart, yIndex, rand = 0;

		/**
		 * Check whether the space is not already occupied by a collectable object.
		 * @return true if a collectable already occupy the same space, false otherwise.
		 */
		var isVacantSpace = function() {
			for (var i = 0; i < collectables.length; i++) {
				if (collectables[i].x == xStart && collectables[i].y == yStart) {
					return false;
				}
			}
			return true;
		};

		for (var i = 0; i <= maxCollectables; i++) {
			yIndex = Math.ceil(Math.random()*3) - 1;
			yStart = yCordinates[yIndex];
			xStart = xCordinates[Math.ceil(Math.random()*5) - 1];
			rand = Math.random();
			if (isVacantSpace()) {
				if (numHearts < maxHearts && player.lifeCount <= 5 && rand > .98) {
					collectables.push(new Heart({
						x: xStart,
						y: yStart,
						sprite: 'images/Heart.png',
						countViewId: '#lives'
					}));
					numHearts++;
				} else if (numRocks < maxRocks && player.rocks <= 10 && rand > .70) {
					collectables.push(new Rock({
						x: xStart,
						y: yStart,
						sprite: 'images/Rock.png',
						countViewId: '#rocks'
					}));
					numRocks++;
				} else if (numGems < maxGems) {
					if (rand < .4) {
						// Add Blue Gem
						collectables.push(new BlueGem({
							x: xStart,
							y: yStart,
							sprite: 'images/Gem Blue.png',
							points: 100,
							countViewId: '#blue-gems'
						}));
					} else if (rand >= .4 && rand < .65) {
						// Add Green Gem
						collectables.push(new GreenGem({
							x: xStart,
							y: yStart,
							sprite: 'images/Gem Green.png',
							points: 200,
							countViewId: '#green-gems'
						}));
					} else {
						// Add Orange Gem
						collectables.push(new OrangeGem({
							x: xStart,
							y: yStart,
							sprite: 'images/Gem Orange.png',
							points: 300,
							countViewId: '#orange-gems'
						}));
					}
					numGems++;
				}
			}
		}
		return collectables;
	}
};

/**
 * Scoreboard controls the view that shows the players statistics through out the game.
 * Everytime a player collects a collectable item or reaches the water, the scoreboard
 * is upated.
 */
var Scoreboard = function Scoreboard() {
	this.collectablesViewIds = [
		"#blue-gems",
		"#green-gems",
		"#orange-gems",
		"#rocks",
		"#lives",
	]
	this.scoreboardClass = ".scoreboard";
};
Scoreboard.prototype = {
	/**
	 * Update the value of the score in the view
	 * @param {string} the new score value.
	 */
	updateScore: function(score) {
		document.getElementById("score").innerHTML = "SCORE: "+ score;
	},
	/**
	 * Update the value of the collectable object the player has.
	 * @param  {string} viewId id of the div representing the collectable item.
	 * @param  {string} value  new value of the collectable
	 */
	updateCollectable: function(viewId, value){
		document.querySelector(viewId + " > h4 > span").innerHTML = value;
	},
	/**
	 * Iterate through all the collectables and reset them in the view.
	 */
	reset: function() {
		var viewId, value;

		for (var i=0; i< this.collectablesViewIds.length; i++) {
			viewId = this.collectablesViewIds[i];
			value = "#lives" == viewId ? 3 : 0;
			this.updateCollectable(viewId, value);
		}

		this.updateScore(0);
	},
	/**
	 * Hide the scoreboard div.
	 */
	hide: function() {
		document.querySelector(this.scoreboardClass).style.display = "none";
	},
	/**
	 * Show the scoreboard div
	 */
	show: function() {
		document.querySelector(this.scoreboardClass).style.display = "block";
	}
};

/**
 * Enemies that the player should avoid.
 * @param {int} x            x cordinate of the enemy
 * @param {int} y            y cordinate of the enemy
 * @param {int} dtMultiplier a time delta between ticks
 */
var Enemy = function(x, y, dtMultiplier) {
	this.x = x;
	this.y = y;
	this.dtMultiplier = dtMultiplier;
	this.width = 60; // The width of the enemy sprite.
	this.height = 60; // The length of the enemy.
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
	this.isAlive = true;
};

Enemy.prototype = {
	/**
	 * Update the enemy's position, required method for game.
	 * Any movement is multiplied by the dt parameter to ensure the game runs at the same
	 * speed for all computers. If the enemy reaches the end of the canvas then reset
	 * the position.
	 * A collision check is done after updating the position.
	 *
	 * @param  {int} dt a time delta between ticks
	 */
	update: function(dt) {
		if (this.x > ctx.canvas.width) {
			this.x = -100;
		}
		if (this.isAlive) {
			this.x = this.x + this.dtMultiplier*dt;
		}
		this.checkCollisions();
	},

	/**
	 * Draw the enemy on the screen, required method for game
	 */
	render: function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	},

	/**
	 * Checks if enemy collides with the player. If enemy collides with the player,
	 * the players reset function is called.
	 */
	checkCollisions: function() {
		// If enemy collides with the player, mark the player as wounded and reset player.
		if (game.hasCollided(this, player)) {
			player.wounded = true;
			player.reset();
		}

		// If game.thrown rocks has a length greater than zero the player has thrown a rock
		// Loop through all the rocks and check if it has hit the enemy.
		// Destroy the rock and kill the enemy if the rock and enemy collides.
		if (game.thrownRocks.length > 0) {
			for (var i = 0; i < game.thrownRocks.length; i++) {
				var rock = game.thrownRocks[i];
				if(rock.thrown && game.hasCollided(this, rock)) {
					rock.destroy();
					rock.thrown = false;
					this.killed();
				}
			}
		}
	},
	/**
	 * Set the isAlive flag as false to indicate that the enemy is dead and move it out of
	 * the playing area.
	 */
	killed: function() {
		this.isAlive = false;
		this.x = -100;
	}
};

/**
 * Represents all collectable items in the game.
 * @param {object} initState object containing the initial states of the Collectable
 */
var Collectable = function(initState) {
	this.sprite = initState.sprite;
	this.x = initState.x;
	this.y = initState.y;
	this.width = initState.width || 40;
	this.height = initState.height || 40;
	this.countViewId = initState.countViewId;
	this.destroyed = false;
};

Collectable.prototype = {
	render: function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 60, 102);
	},
	/**
	 * Update the collectable for each game tick. The collectables are stationary
	 * but they can be collected by the player. So the update function checks whether
	 * a player collides with the collectable and it the player does, then the collectable
	 * is removed from the board and the players points are updated if the collectable
	 * item was worth any points.
	 */
	update: function() {
		if (game.hasCollided(this, player)) {
			this.destroy();
			var newCount = this.incrementPlayerCollectableCount(1);
			game.scoreboard.updateCollectable(this.countViewId, newCount);
			if (this.hasOwnProperty('points')) {
				player.incrementScore(this.points);
				game.scoreboard.updateScore(player.score);
			}
		}
	},
	/**
	 * To destroy the object is moved out of the playing area.
	 */
	destroy: function () {
		this.destroyed = true;
		this.x = -100;
	}
};

/**
 * A Gem collectable object which is the parent class of all Gems on the board.
 *
 * @param {object} initState object containing the initial states of the Collectable
 */
var Gem = function(initState) {
	Collectable.call(this, initState);
	this.points = initState.points;
};
Gem.prototype = Object.create(Collectable.prototype);
Gem.prototype.constructor = Gem;

/**
 * Blue gem collectable
 * @param {object} initState object containing the initial states of the Collectable
 */
var BlueGem = function(initState) {
	Gem.call(this, initState);
};
BlueGem.prototype = Object.create(Gem.prototype);
BlueGem.prototype.constructor = BlueGem;
/**
 * Update the number of blue gems the player has
 * @return {int} the number of blue gems the player has.
 */
BlueGem.prototype.incrementPlayerCollectableCount = function(x) {
	return player.incrementBlueGems(x);
};

/**
 * Green gem collectable
 * @param {object} initState object containing the initial states of the Collectable
 */
var GreenGem = function(initState) {
	Gem.call(this, initState);
};
GreenGem.prototype = Object.create(Gem.prototype);
GreenGem.prototype.constructor = GreenGem;
/**
 * Update the number of green gems the player has
 * @return {int} the number of green gems the player has.
 */
GreenGem.prototype.incrementPlayerCollectableCount = function(x) {
	return player.incrementGreenGems(x);
};

/**
 * Orange gem collectable
 * @param {object} initState object containing the initial states of the Collectable
 */
var OrangeGem = function(initState) {
	Gem.call(this, initState);
};
OrangeGem.prototype = Object.create(Gem.prototype);
OrangeGem.prototype.constructor = OrangeGem;
/**
 * Update the number of orange gems the player has
 * @return {int} the number of orange gems the player has.
 */
OrangeGem.prototype.incrementPlayerCollectableCount = function(x) {
	return player.incrementOrangeGems(x);
};

/**
 * Heart collectable
 * @param {object} initState object containing the initial states of the Collectable
 */
var Heart = function(initState) {
	Collectable.call(this, initState);
};
Heart.prototype = Object.create(Collectable.prototype);
Heart.prototype.constructor = Heart;
/**
 * Update the players life count
 * @return {int} the number of lives the player has.
 */
Heart.prototype.incrementPlayerCollectableCount = function(x) {
	return player.incrementLifeCount(x);
};

/**
 * Rock collectable
 * @param {object} initState object containing the initial states of the Collectable
 */
var Rock = function(initState) {
	Collectable.call(this, initState);
	this.thrown = false;
};
Rock.prototype = Object.create(Collectable.prototype);
Rock.prototype.constructor = Rock;
/**
 * Update the number of rocks the player has
 * @return {int} the number of rocks the player has.
 */
Rock.prototype.incrementPlayerCollectableCount = function(x) {
	return player.incrementRocks(x);
};

Rock.prototype.update = function() {
	if (this.thrown && !this.destroyed) {
		this.x = this.x - 10;
	} else {
		Collectable.prototype.update.call(this);
	}
};


/**
 * Player object
 * @param {string} sprite path to the player sprite
 */
var Player = function(sprite) {
	this.sprite = sprite;
	this.origin = {x: 200, y: 310}
	this.step = {x: 100, y: 80};
	this.x = this.origin.x;
	this.y = this.origin.y;
	this.width = 60;
	this.height= 70;
	this.lifeCount = 3;
	this.wounded = false;
	this.score = 0;
	this.blueGems = 0;
	this.greenGems = 0;
	this.orangeGems = 0;
	this.rocks = 0;
};

Player.prototype = {
	update: function(dt) {

	},
	render: function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	},
	incrementLifeCount: function(increment) {
		this.lifeCount += increment;
		return this.lifeCount;
	},
	incrementScore: function(increment) {
		this.score += increment;
		return this.score;
	},
	incrementBlueGems: function(increment) {
		this.blueGems += increment;
		return this.blueGems;
	},
	incrementGreenGems: function(increment) {
		this.greenGems += increment;
		return this.greenGems;
	},
	incrementOrangeGems: function(increment) {
		this.orangeGems += increment;
		return this.orangeGems;
	},
	incrementRocks: function(increment) {
		this.rocks += increment;
		return this.rocks;
	},
	isAlive: function() {
		return this.lifeCount > 0;
	},
	reachedWater: function() {
		this.score += 100;
		game.scoreboard.updateScore(this.score);
	},
	/**
	 * Move player left, right, up or down based on the key that is pressed.
	 * @param  {string} keyCode indicate which arrow key was pressed.
	 */
	handleInput: function(keyCode) {
		switch(keyCode) {
			case 'throw':
				this.throwRock();
			break;
			case 'left':
				this.moveLeft();
			break;
			case 'up':
				this.moveUp();
			break;
			case 'right':
				this.moveRight();
			break;
			case 'down':
				this.moveDown();
			break;
			default:
			break;
		}
	},
	throwRock: function() {
		if (this.rocks > 0) {
			var rock = new Rock({
				x: this.x,
				y: this.y + 25,
				sprite: 'images/Rock.png',
				countViewId: '#rocks'
			});
			rock.thrown = true;
			this.rocks--;
			game.scoreboard.updateCollectable(rock.countViewId, this.rocks);
			collectables.push(rock);
			game.thrownRocks.push(rock);
		}
	},
	moveLeft: function() {
		if(this.x != 0) {
			this.x -= this.step.x;
		}
	},
	moveUp: function() {
		if(this.y != 70) {
			this.y -= this.step.y;
		} else {
			this.reset();
		}
	},
	moveRight: function() {
		if(this.x != 400) {
			this.x += this.step.x;
		}
	},
	moveDown: function() {
		if(this.y != 390) {
			this.y += this.step.y;
		}
	},
	/**
	 * Reset the player to the origin and create new enemies and collectables.
	 * If the player is hit by an enemy decrement the life count. If the life
	 * count is zero then game is over.
	 */
	reset: function() {
		if (this.wounded) {
			this.lifeCount--;
			this.wounded = false;
			game.scoreboard.updateCollectable("#lives", this.lifeCount);

			if (this.lifeCount == 0) {
				game.gameOver();
			} else {
				alert("You hit a bug and got wounded. You have "+ this.lifeCount + " lives remaining.");
			}
		} else {
			// Reached end, update score
			player.reachedWater();
		}
		this.x = this.origin.x;
		this.y = this.origin.y;
		allEnemies = game.getEnemies();
		collectables = game.getCollectables();
	}
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		32: 'throw',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
