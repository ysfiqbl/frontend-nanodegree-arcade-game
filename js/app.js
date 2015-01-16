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
}

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
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
 * Checks if enemy collides with the player. If enemy collides with the player,
 * the players reset function is called.
 */
Enemy.prototype.checkCollisions = function() {
    if (hasCollided(this, player)) {
        player.wounded = true;
        player.reset();
    }
}

function hasCollided(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x
        && a.y < b.y + b.height && a.y + a.width > b.y;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.origin = {x: 200, y: 390}
    this.x = this.origin.x;
    this.y = this.origin.y;
    this.width = 60;
    this.height= 70;
    this.lifeCount = 3;
    this.wounded = false;
}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

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
                this.x = this.x - xStep;
            }
        break;
        case 'up':
            if(this.y != 70) {
                this.y = this.y - yStep;
            } else {
                this.reset();
            }
        break;
        case 'right':
            if(this.x != 400) {
                this.x = this.x + xStep;
            }
        break;
        case 'down':
            if(this.y != 390) {
                this.y = this.y + yStep;
            }
        break;
        default:
        break;
    }

    console.log(this.y);
}

Player.prototype.checkCollisions = function() {

};

Player.prototype.reset = function() {
    if (this.wounded) {
        this.lifeCount--;
        this.wounded = false;
        document.querySelector("#lives > h4 > span").innerHTML = this.lifeCount;
    }
    if (this.lifeCount == 0) {
        alert("Game Over");
    } else {
        alert(this.lifeCount + " lives remaining.")
        this.x = this.origin.x;
        this.y = this.origin.y;
        allEnemies = getEnemies();
    }
    console.log(this.lifeCount);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
function getEnemies() {
    var enemies = [];
    var yCordinates = [60, 145, 230];
    var yEnemyMax = 1;
    var yEnemyCounter = [0, 0, 0];
    var xCordinates = [1, 200, 400];
    var maxEnemies = 3;
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

    console.log(totalEnemies);

    return enemies;
}
var allEnemies = getEnemies();

// Place the player object in a variable called player
var player = new Player();


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
