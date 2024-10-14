// Select the canvas and set up the context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Constants and global variables
const FLOOR_HEIGHT = 50;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const GRAVITY = 0.8;
const JUMP_STRENGTH = 15;
const PLAYER_SPEED = 5;
const GAME_SPEED = 3;

let gameOver = false;
let score = 0;

// Load the player image
const playerImage = new Image();
playerImage.src = 'path/to/player-image.png'; // Replace with the actual image path

// Define the player object with movement controls and jumping
const player = {
    x: 100,
    y: canvas.height - FLOOR_HEIGHT - PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocityY: 0,
    isJumping: false,
    isOnGround: true,

    draw: function() {
        ctx.drawImage(playerImage, this.x, this.y, this.width, this.height); // Draw player as an image
    },
    update: function() {
        // Gravity effect
        this.y += this.velocityY;
        this.velocityY += GRAVITY;

        // Stop the player from falling below the floor
        if (this.y + this.height > canvas.height - FLOOR_HEIGHT) {
            this.y = canvas.height - FLOOR_HEIGHT - this.height;
            this.isOnGround = true;
            this.velocityY = 0;
        } else {
            this.isOnGround = false;
        }
    },
    jump: function() {
        if (this.isOnGround) {
            this.velocityY = -JUMP_STRENGTH;
            this.isJumping = true;
            this.isOnGround = false;
        }
    },
    moveLeft: function() {
        this.x -= PLAYER_SPEED;
        if (this.x < 0) this.x = 0; // Keep player within bounds
    },
    moveRight: function() {
        this.x += PLAYER_SPEED;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width; // Keep player within bounds
    }
};

// Handle player movement with keyboard events
let keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

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

// Candy class (for bonus items)
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

// Game variables
let enemies = [];
let candies = [];

// Main game loop
function gameLoop() {
    if (!gameOver) {
        // Clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw floor
        ctx.fillStyle = '#8B4513'; // Brown color for the floor
        ctx.fillRect(0, canvas.height - FLOOR_HEIGHT, canvas.width, FLOOR_HEIGHT);

        // Handle player movement
        if (keys['ArrowLeft']) player.moveLeft();
        if (keys['ArrowRight']) player.moveRight();
        if (keys['Space']) player.jump();

        // Update and draw player
        player.update();
        player.draw();

        // Update and draw enemies
        enemies.forEach((enemy, index) => {
            enemy.update();
            enemy.draw();
            if (collisionDetection(player, enemy)) {
                gameOver = true;
                document.getElementById('gameOverMessage').style.display = 'block';
            }
        });

        // Update and draw candies
        candies.forEach((candy, index) => {
            candy.update();
            candy.draw();
            if (collisionDetection(player, candy)) {
                score += 10;
                candies.splice(index, 1); // Remove candy after collision
            }
        });

        // Remove off-screen enemies and candies
        enemies = enemies.filter(enemy => enemy.x + enemy.width > 0);
        candies = candies.filter(candy => candy.x + candy.size > 0);

        // Draw score
        ctx.fillStyle = '#000000'; // Black color for text
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);

        requestAnimationFrame(gameLoop); // Continue the game loop
    }
}

// Collision detection (basic AABB - Axis-Aligned Bounding Box)
function collisionDetection(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Spawn enemies every 2 seconds
setInterval(() => {
    if (!gameOver) {
        enemies.push(new Enemy());
    }
}, 2000);

// Spawn candies every 3 seconds
setInterval(() => {
    if (!gameOver) {
        candies.push(new Candy());
    }
}, 3000);

// Start the game loop
window.onload = () => {
    gameLoop();
};
