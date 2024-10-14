const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Constants
const FLOOR_HEIGHT = 50;
const GRAVITY = 0.5;
const PLAYER_JUMP_VELOCITY = -12;
const GAME_SPEED = 5;
const COLORS = {
    BLUE_SKY: '#87CEEB',
    BROWN_FLOOR: '#8B4513',
    GREEN_PLAYER: '#00FF00',
    RED_ENEMY: '#FF0000',
    PURPLE_THORN: '#800080',
    GOLD_COIN: '#FFD700',
    WHITE_CLOUD: '#FFFFFF',
    BLACK: '#000000'
};

// Variables
let player = null;
let enemies = [];
let thorns = [];
let coins = [];
let clouds = [];
let gameOver = false;
let score = 0;
let jumpCount = 0;

// Game Objects
class Player {
    constructor() {
        this.width = 30;
        this.height = 50;
        this.x = 50;
        this.y = canvas.height - FLOOR_HEIGHT - this.height;
        this.dy = 0;
    }

    draw() {
        ctx.fillStyle = COLORS.GREEN_PLAYER;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.dy += GRAVITY;
        this.y += this.dy;

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
}

class Enemy {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = canvas.width;
        this.y = canvas.height - FLOOR_HEIGHT - this.height;
    }

    draw() {
        ctx.fillStyle = COLORS.RED_ENEMY;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= GAME_SPEED;
    }
}

// Other objects (thorn, coin, cloud) would have similar structure to Enemy

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
    document.getElementById('gameOverMessage').style.display = 'none';
    gameLoop();
}

// Start game
player = new Player();
setInterval(() => {
    if (!gameOver) {
        enemies.push(new Enemy());
    }
}, 1500); // Spawn enemies every 1.5 seconds

// Input handling
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        player.jump();
    }

    if (event.code === 'KeyR' && gameOver) {
        resetGame();
    }
});

gameLoop();