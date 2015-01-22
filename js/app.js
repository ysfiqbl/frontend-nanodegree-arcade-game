// y and x distance when moving between two squares
var yStep = 80;
var xStep = 100;
var player = null;
var allEnemies = null;
var collectables = null;
var characters = [];
var game;
var scoreboard;

var Game = function Game() {
    this.canvasWidth = ctx.canvas.width;
    this.canvasHeight = ctx.canvas.height;
    this.mainMenuClass = ".main-menu";
    this.gameOverMenuClass = ".game-over-menu";
    scoreboard = new Scoreboard();
}

Game.prototype = {
    mainMenu: function() {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        var mainMenuDiv = document.querySelector(".main-menu");
        mainMenuDiv.style.display = "block";
        mainMenuDivChildren = mainMenuDiv.children;
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
    gameOver: function() {
        ctx.shadowColor = "black";
        ctx.shadowOffsetX= 10;
        ctx.shadowOffsetY = 10;
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#812807";
        ctx.fillRect(40, 200, this.canvasWidth - 80, this.canvasHeight - 400);

        ctx.shadowOffsetX= 0;
        ctx.shadowOffsetY = 0;
        ctx.font = "48px serif"
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
    hideMainMenu: function() {
        document.querySelector(this.mainMenuClass).style.display = "none";
    },
    removeGameOverMenu: function() {
        scoreboard.hide();
        document.body.removeChild(document.querySelector(this.gameOverMenuClass));
    },
    hasCollided: function(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x
            && a.y < b.y + b.height && a.y + a.width > b.y;
    },
    // Now instantiate your objects.
    start: function(playerSprite) {
        scoreboard.show();
        scoreboard.reset();
        allEnemies = this.getEnemies();
        collectables = this.getCollectables();
        // Place the player object in a variable called player
        player = new Player(playerSprite);
    },

    // Place all enemy objects in an array called allEnemies
    getEnemies: function() {
        var enemies = [];
        var yCordinates = [60, 145, 230];
        var yEnemyMax = 1;
        var yEnemyCounter = [0, 0, 0];
        var xCordinates = [1, 200, 400];
        var maxEnemies = 4;
        var totalEnemies = 0;

        while (totalEnemies <= maxEnemies) {
            var dtMultiplier = Math.ceil(Math.random()*300 + 100);
            var yIndex = Math.ceil(Math.random()*3) - 1;
            var yStart = yCordinates[yIndex];
            var xStart = xCordinates[Math.ceil(Math.random()*3) - 1];
            if (yEnemyCounter[yIndex] <= yEnemyMax) {
                enemies.push(new Enemy(xStart, yStart, dtMultiplier));
                yEnemyCounter[yIndex]++;
                totalEnemies = yEnemyCounter[0] + yEnemyCounter[1] + yEnemyCounter[2];
            }
        }
        return enemies;
    },
    getCollectables: function() {
        var collectables = [];
        var yCordinates = [100, 185, 270];
        var xCordinates = [20, 120, 220, 320, 420];
        var maxGems = 2, numGems = 0;
        var maxHearts = 1, numHearts = 0;
        var maxRocks = 2, numRocks = 0;
        var maxCollectables = maxGems + maxHearts + maxRocks;
        var xStart, yStart, yIndex, rand = 0;

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
                if (numHearts < maxHearts && rand > .98) {
                    collectables.push(new Heart({
                        x: xStart,
                        y: yStart,
                        sprite: 'images/Heart.png',
                        countViewId: '#lives'
                    }));
                    numHearts++;
                } else if (numRocks < maxRocks && rand > .70) {
                    collectables.push(new Rock({
                        x: xStart, y:
                        yStart,
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
    updateScore: function(score) {
        document.getElementById("score").innerHTML = "SCORE: "+ score;
    },
    updateCollectable: function(viewId, value){
        document.querySelector(viewId + " > h4 > span").innerHTML = value;
    },
    reset: function() {
        var viewId, value;

        for (var i=0; i< this.collectablesViewIds.length; i++) {
            viewId = this.collectablesViewIds[i];
            value = "#lives" == viewId ? 3 : 0;
            this.updateCollectable(viewId, value);
        }

        this.updateScore(0);
    },
    hide: function() {
        document.querySelector(this.scoreboardClass).style.display = "none";
    },
    show: function() {
        document.querySelector(this.scoreboardClass).style.display = "block";
    }
};

// Enemies our player must avoid
var Enemy = function(x, y, dtMultiplier) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.dtMultiplier = dtMultiplier;
    this.width = 60
    this.height = 60;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > ctx.canvas.width) {
        this.x = -100;
    }
   this.x = this.x + this.dtMultiplier*dt;
   this.checkCollisions();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Checks if enemy collides with the player. If enemy collides with the player,
 * the players reset function is called.
 */
Enemy.prototype.checkCollisions = function() {
    if (game.hasCollided(this, player)) {
        player.wounded = true;
        player.reset();
    }
};

var Collectable = function(initState) {
    this.sprite = initState.sprite;
    this.x = initState.x;
    this.y = initState.y;
    this.width = initState.width || 40;
    this.height = initState.height || 40;
    this.countViewId = initState.countViewId;
};

Collectable.prototype = {
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 60, 102);
    },
    update: function() {
        if (game.hasCollided(this, player)) {
            this.destroy();
            var newCount = this.updatePlayerCollectableCount();
            scoreboard.updateCollectable(this.countViewId, newCount);
            if (this.hasOwnProperty('points')) {
                player.incrementScore(this.points);
                scoreboard.updateScore(player.score);
            }
        }
    },
    destroy: function () {
        this.x = -100;
    }
};

var Gem = function(initState) {
    Collectable.call(this, initState);
    this.points = initState.points;
};
Gem.prototype = Object.create(Collectable.prototype);
Gem.prototype.constructor = Gem;

var BlueGem = function(initState) {
    Gem.call(this, initState);
};
BlueGem.prototype = Object.create(Gem.prototype);
BlueGem.prototype.constructor = BlueGem;
BlueGem.prototype.updatePlayerCollectableCount = function() {
    return player.incrementBlueGems(1);
};

var GreenGem = function(initState) {
    Gem.call(this, initState);
};
GreenGem.prototype = Object.create(Gem.prototype);
GreenGem.prototype.constructor = GreenGem;
GreenGem.prototype.updatePlayerCollectableCount = function() {
    return player.incrementGreenGems(1);
};

var OrangeGem = function(initState) {
    Gem.call(this, initState);
};
OrangeGem.prototype = Object.create(Gem.prototype);
OrangeGem.prototype.constructor = OrangeGem;
OrangeGem.prototype.updatePlayerCollectableCount = function() {
    return player.incrementOrangeGems(1);
};

var Heart = function(initState) {
    Collectable.call(this, initState);
};
Heart.prototype = Object.create(Collectable.prototype);
Heart.prototype.constructor = Heart;
Heart.prototype.updatePlayerCollectableCount = function() {
    return player.incrementLifeCount(1);
};

var Rock = function(initState) {
    Collectable.call(this, initState);
};
Rock.prototype = Object.create(Collectable.prototype);
Rock.prototype.constructor = Rock;
Rock.prototype.updatePlayerCollectableCount = function() {
    return player.incrementRocks(1);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sprite) {
    this.sprite = sprite;
    this.origin = {x: 200, y: 310}
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

Player.prototype.update = function(dt) {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.incrementLifeCount = function(increment) {
    this.lifeCount+=increment;
    return this.lifeCount;
};

Player.prototype.incrementScore = function(increment) {
    this.score+=increment;
    return this.score;
};

Player.prototype.incrementBlueGems = function(increment) {
    this.blueGems+=increment;
    return this.blueGems;
};

Player.prototype.incrementGreenGems = function(increment) {
    this.greenGems+=increment;
    return this.greenGems;
};

Player.prototype.incrementOrangeGems = function(increment) {
    this.orangeGems+=increment;
    return this.orangeGems;
};

Player.prototype.incrementRocks = function(increment) {
    this.rocks+=increment;
    return this.rocks;
}

Player.prototype.isAlive = function() {
    return this.lifeCount > 0;
};

Player.prototype.reachedWater = function() {
    this.score+=100;
    scoreboard.updateScore(this.score);
};

/**
 * Move player left, right, up or down based on the key that is pressed.
 * @param  {string} keyCode indicate which arrow key was pressed.
 */
Player.prototype.handleInput = function(keyCode) {
    var yStep = 80;
    var xStep = 100;
    switch(keyCode) {
        case 'left':
            if(this.x != 0) {
                this.x -= xStep;
            }
        break;
        case 'up':
            if(this.y != 70) {
                this.y -= yStep;
            } else {
                this.reset();
            }
        break;
        case 'right':
            if(this.x != 400) {
                this.x += xStep;
            }
        break;
        case 'down':
            if(this.y != 390) {
                this.y += yStep;
            }
        break;
        default:
        break;
    }
};

Player.prototype.checkCollisions = function() {

};

Player.prototype.reset = function() {
    if (this.wounded) {
        this.lifeCount--;
        this.wounded = false;
        scoreboard.updateCollectable("#lives", this.lifeCount);

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
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
