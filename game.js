const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Game Variables
let score = 0;
let gameOver = false;
const gravity = 0.5;
const playerJumpVelocity = -12;
const floorHeight = 50;
const gameSpeed = 5;

// Player Object
const player = {
    x: 50,
    y: canvas.height - floorHeight - 100,
    width: 50,
    height: 50,
    dy: 0,
    jumpCount: 0,
    maxJumps: 2,
    color: 'green',
    update() {
        this.dy += gravity;
        this.y += this.dy;
        if (this.y + this.height >= canvas.height - floorHeight) {
            this.y = canvas.height - floorHeight - this.height;
            this.dy = 0;
            this.jumpCount = 0;
        }
    },
    jump() {
        if (this.jumpCount < this.maxJumps) {
            this.dy = playerJumpVelocity;
            this.jumpCount++;
        }
    },
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// Obstacles and Candies Arrays
const obstacles = [];
const candies = [];

// Function to add an obstacle (Car)
function addObstacle() {
    const carWidth = 50;
    const carHeight = 30;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - floorHeight - carHeight,
        width: carWidth,
        height: carHeight,
        color: 'red',
        update() {
            this.x -= gameSpeed;
            if (this.x + this.width < 0) {
                obstacles.shift();
            }
        },
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    });
}

// Function to add candy
function addCandy() {
    const candySize = 20;
    candies.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - floorHeight - 50),
        size: candySize,
        color: 'purple',
        update() {
            this.x -= gameSpeed;
            if (this.x + this.size < 0) {
                candies.shift();
            }
        },
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    });
}

// Draw floor
function drawFloor() {
    ctx.fillStyle = '#8b4513'; // Brown floor
    ctx.fillRect(0, canvas.height - floorHeight, canvas.width, floorHeight);
}

// Check for collisions with obstacles
function checkCollision(obstacle) {
    return (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    );
}

// Check for candy collection
function checkCandyCollision(candy) {
    return (
        player.x < candy.x + candy.size &&
        player.x + player.width > candy.x &&
        player.y < candy.y + candy.size &&
        player.y + player.height > candy.y
    );
}

// Game loop
function gameLoop() {
    if (gameOver) return;

    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw player
    player.update();
    player.draw();

    // Draw floor
    drawFloor();

    // Update and draw obstacles
    obstacles.forEach(obstacle => {
        obstacle.update();
        obstacle.draw();
        if (checkCollision(obstacle)) {
            gameOver = true;
            document.getElementById('game-over').style.display = 'block';
        }
    });

    // Update and draw candies
    candies.forEach((candy, index) => {
        candy.update();
        candy.draw();
        if (checkCandyCollision(candy)) {
            score += 10;
            candies.splice(index, 1); // Remove candy after collection
            document.getElementById('score').innerText = `Score: ${score}`;
        }
    });

    // Spawn obstacles and candies
    if (Math.random() < 0.02) addObstacle();
    if (Math.random() < 0.01) addCandy();

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

// Event listener for jumping
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) {
        player.jump();
    }
    if (e.code === 'KeyR' && gameOver) {
        location.reload(); // Restart game
    }
});
