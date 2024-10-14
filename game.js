const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Constants
const FLOOR_HEIGHT = 50;
const GRAVITY = 0.5;
const PLAYER_JUMP_VELOCITY = -12;
let GAME_SPEED = 3; // Start with slower speed
const SPEED_INCREMENT = 0.2; // Gradual speed increase
const COLORS = {
    BLUE_SKY: '#87CEEB',
    BROWN_FLOOR: '#8B4513',
    BLACK: '#000000',
    WHEEL_COLOR: '#333333',
    CANDY_COLOR: '#FFD700'
};
const CAR_BODY_COLORS = ['#FF6347', '#FFD700', '#ADFF2F', '#FF69B4', '#1E90FF', '#8A2BE2', '#00CED1']; // Car body colors

// Variables
let player = null;
let enemies = [];
let candies = [];
let gameOver = false;
let score = 0;
let jumpCount = 0;
let keysPressed = {};

// Load character image
const playerImage = new Image();
playerImage.src = 'head.png'; // Provide the correct path to the player image

// Game Objects
class Player {
    constructor() {
        this.width = 115;
        this.height = 153;
        this.x = 50;
        this.y = canvas.height - FLOOR_HEIGHT - this.height;
        this.dy = 0;
        this.speed = 5; // Speed for moving left and right
    }

    draw() {
        if (playerImage.complete) {
            ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
        } else {
            playerImage.onload = () => {
                ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
            };
        }
    }

    update() {
        this.dy += GRAVITY;
        this.y += this.dy;

        // Prevent player from falling below the floor
        if (this.y + this.height >= canvas.height - FLOOR_HEIGHT) {
            this.y = canvas.height - FLOOR_HEIGHT - this.height;
            this.dy = 0;
            jumpCount = 0;  // Reset jump count on landing
        }
    }

    jump() {
        if (jumpCount < 2) {
            this.dy = PLAYER_JUMP_VELOCITY;
            jumpCount += 1;
        }
    }

    moveLeft() {
        this.x = Math.max(0, this.x - this.speed);
    }

    moveRight() {
        this.x = Math.min(canvas.width - this.width, this.x + this.speed);
    }

    moveUp() {
        this.y = Math.max(0, this.y - this.speed);
    }

    moveDown() {
        this.y = Math.min(canvas.height - FLOOR_HEIGHT - this.height, this.y + this.speed);
    }
}

// Candy class
class Candy {
    constructor() {
        this.width = 20;
        this.height = 20;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * (canvas.height - FLOOR_HEIGHT - 50);
        this.color = COLORS.CANDY_COLOR;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= GAME_SPEED;
    }
}

// Car-shaped enemy class
class Enemy {
    constructor() {
        this.width = 60;  // Car body width
        this.height = 30; // Car body height
        this.wheelRadius = 10; // Wheel radius
        this.x = canvas.width;
        // Randomly position the enemy on the y-axis, above the floor or flying in the air
        this.y = Math.random() > 0.5
            ? canvas.height - FLOOR_HEIGHT - this.height // On the floor
            : Math.random() * (canvas.height - FLOOR_HEIGHT - this.height - 50); // Flying at a random height above the floor
        this.bodyColor = CAR_BODY_COLORS[Math.floor(Math.random() * CAR_BODY_COLORS.length)]; // Random car body color
    }

    draw() {
        // Draw car body
        ctx.fillStyle = this.bodyColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw car wheels
        ctx.fillStyle = COLORS.WHEEL_COLOR;
        // Front wheel
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + this.height, this.wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        // Rear wheel
        ctx.beginPath();
        ctx.arc(this.x + this.width - 10, this.y + this.height, this.wheelRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x -= GAME_SPEED;
    }
}

// Game Loop
function gameLoop() {
    if (!gameOver) {
        // Clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw floor
        ctx.fillStyle = COLORS.BROWN_FLOOR;
        ctx.fillRect(0, canvas.height - FLOOR_HEIGHT, canvas.width, FLOOR_HEIGHT);

        // Draw player
        player.draw();
        player.update();

        // Draw and update enemies
        enemies.forEach(enemy => {
            enemy.draw();
            enemy.update();

            // Collision detection
            if (collisionDetection(player, enemy)) {
                gameOver = true;
                document.getElementById('gameOverMessage').style.display = 'block';
            }
        });

        // Move enemies off-screen and reset when needed
        enemies = enemies.filter(enemy => enemy.x + enemy.width > 0);

        // Draw and update candies
        candies.forEach(candy => {
            candy.draw();
            candy.update();

            // Check if player collects candy
            if (collisionDetection(player, candy)) {
                score += 10;
                candies = candies.filter(c => c !== candy); // Remove collected candy
            }
        });

        // Move candies off-screen and reset when needed
        candies = candies.filter(candy => candy.x + candy.width > 0);

        // Draw score
        ctx.fillStyle = COLORS.BLACK;
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);

        requestAnimationFrame(gameLoop);
    }
}

// Collision detection
function collisionDetection(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.height + rect1.y > rect2.y;
}

// Restart game
function resetGame() {
    gameOver = false;
    score = 0;
    player = new Player();
    enemies = [];
    candies = [];
    document.getElementById('gameOverMessage').style.display = 'none';
    gameLoop();
}

// Increase game speed
function increaseSpeed() {
    GAME_SPEED += SPEED_INCREMENT;
}

// Start game
player = new Player();
setInterval(() => {
    if (!gameOver) {
        enemies.push(new Enemy());
        candies.push(new Candy()); // Add candy occasionally
    }
}, 1500); // Spawn enemies and candies every 1.5 seconds

// Button event listeners
document.getElementById('jumpButton').addEventListener('click', () => player.jump());
document.getElementById('restartButton').addEventListener('click', resetGame);
document.getElementById('speedButton').addEventListener('click', increaseSpeed);

// Joystick event listeners
const joystick = document.getElementById('joystick');
const joystickInner = document.getElementById('joystickInner');
let joystickActive = false;

joystick.addEventListener('touchstart', (event) => {
    joystickActive = true;
});

joystick.addEventListener('touchmove', (event) => {
    if (joystickActive) {
        const touch = event.touches[0];
        const joystickRect = joystick.getBoundingClientRect();
        const offsetX = touch.clientX - joystickRect.left - joystickRect.width / 2;
        const offsetY = touch.clientY - joystickRect.top - joystickRect.height / 2;

        if (Math.abs(offsetX) > 20) {
            if (offsetX < 0) {
                player.moveLeft();
            } else {
                player.moveRight();
            }
        }

        if (Math.abs(offsetY) > 20) {
            if (offsetY < 0) {
                player.moveUp();
            } else {
                player.moveDown();
            }
        }
    }
});

joystick.addEventListener('touchend', () => {
    joystickActive = false;
});

gameLoop();
