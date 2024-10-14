// Initialize the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Define constants and variables
const FLOOR_HEIGHT = 50;
const GAME_SPEED = 2;
const PLAYER_SPEED = 5;
const JUMP_FORCE = 15;
const GRAVITY = 0.7;
const COLORS = {
    BROWN_FLOOR: '#8B4513',
    BLACK: '#000000'
};

// Load the player image
const playerImage = new Image();
playerImage.src = 'path/to/player-image.png';  // Replace with your image path

// Initialize player with basic physics
const player = {
    x: 100,
    y: canvas.height - FLOOR_HEIGHT - 100,
    width: 50,
    height: 50,
    velocityY: 0, // vertical speed for jumping
    isJumping: false,
    isOnGround: false,
    draw: function() {
        ctx.drawImage(playerImage, this.x, this.y, this.width, this.height); // Draw player as an image
    },
    update: function() {
        // Apply gravity
        this.y += this.velocityY;
        this.velocityY += GRAVITY;

        // Prevent falling below the floor
        if (this.y + this.height > canvas.height - FLOOR_HEIGHT) {
            this.y = canvas.height - FLOOR_HEIGHT - this.height;
            this.isOnGround = true;
            this.isJumping = false;
        } else {
            this.isOnGround = false;
        }
    }
};

// Initialize control variables for movement
let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

// Listen for key presses
window.addEventListener('keydown', function(e) {
    keys[e.code] = true;
});

window.addEventListener('keyup', function(e) {
    keys[e.code] = false;
});

// Handle player movement
function handlePlayerMovement() {
    if (keys.ArrowLeft) {
        player.x -= PLAYER_SPEED; // Move left
        if (player.x < 0) player.x = 0; // Prevent moving out of bounds
    }
    if (keys.ArrowRight) {
        player.x += PLAYER_SPEED; // Move right
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width; // Prevent moving out of bounds
    }
    if (keys.Space && !player.isJumping) {
        player.velocityY = -JUMP_FORCE; // Jump
        player.isJumping = true;
    }
}

// Enemy class
class Enemy {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = canvas.width;
        this.y = canvas.height - FLOOR_HEIGHT - this.height;
    }
    draw() {
        ctx.fillStyle = '#FF0000'; // Red color for enemies
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.x -= GAME_SPEED; // Move enemies to the left
    }
}

// Candy class
class Candy {
    constructor() {
        this.size = 20;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - FLOOR_HEIGHT - this.size); // Random y-position
    }
    draw() {
        ctx.fillStyle = '#FF4500'; // Candy color (orange-red)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        this.x -= GAME_SPEED; // Move candy to the left
    }
}

// Initialize variables
let enemies = [];
let candies = [];
let gameOver = false;
let score = 0;

// Collision detection (basic AABB)
function collisionDetection(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Main game loop
function gameLoop() {
    if (!gameOver) {
        // Clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw floor
        ctx.fillStyle = COLORS.BROWN_FLOOR;
        ctx.fillRect(0, canvas.height - FLOOR_HEIGHT, canvas.width, FLOOR_HEIGHT);

        // Draw and update player
        handlePlayerMovement();
        player.update();
        player.draw();

        // Draw and update enemies
        enemies.forEach((enemy, index) => {
            enemy.draw();
            enemy.update();

            // Collision detection with enemies
            if (collisionDetection(player, enemy)) {
                gameOver = true;
                document.getElementById('gameOverMessage').style.display = 'block';
            }
        });

        // Draw and update candies
        candies.forEach((candy, index) => {
            candy.draw();
            candy.update();

            // Collision detection with candies
            if (collisionDetection(player, {x: candy.x, y: candy.y, width: candy.size, height: candy.size})) {
                score += 10; // Increase score by 10
                candies.splice(index, 1); // Remove candy after collision
            }
        });

        // Remove off-screen enemies and candies
        enemies = enemies.filter(enemy => enemy.x + enemy.width > 0);
        candies = candies.filter(candy => candy.x + candy.size > 0);

        // Draw score
        ctx.fillStyle = COLORS.BLACK;
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);

        requestAnimationFrame(gameLoop); // Continue the game loop
    }
}

// Spawn enemies every 1.5 seconds
setInterval(() => {
    if (!gameOver) {
        enemies.push(new Enemy());
    }
}, 1500);

// Spawn candies every 2 seconds
setInterval(() => {
    if (!gameOver) {
        candies.push(new Candy());
    }
}, 2000);

// Start the game loop
window.onload = () => {
    gameLoop();
};
