// Enemies our player must avoid
var Enemy = function(n, x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.name = n;
    this.x = x;
    this.y = y;
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
   this.x = this.x + 100*dt;
   this.checkCollisions();
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.checkCollisions = function() {
    if (this.x < player.x + player.width && this.x + this.width > player.x
    && this.y < player.y + player.height && this.y + this.width > player.y) {
        player.reset();
        console.log(this.name + ": ("+Math.round(this.x) + "," + this.y + ") (" + player.x + "," + player.y + ")");
    }
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
    this.lives = 3;
}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

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
            if(this.y != 60) {
                this.y = this.y - yStep;
            }
        break;
        case 'right':
            if(this.x != 400) {
                this.x = this.x + xStep;
            }
        break;
        case 'down':
            if(this.y != 380) {
                this.y = this.y + yStep;
            }
        break;
        default:
        break;
    }
}

Player.prototype.checkCollisions = function() {

};

Player.prototype.reset = function() {
    this.lives--;
    if (this.lives == 0) {
        alert("Game Over");
    } else {
        alert(this.lives + " remaining.")
    }
    console.log(this.lives);
    this.x = this.origin.x;
    this.y = this.origin.y;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var e1 = new Enemy("top",1,60);
var e2 = new Enemy("mid",400,145);
var e3 = new Enemy("bot", 200,230);

var allEnemies = [e1, e2, e3];
//allEnemies.push();
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
