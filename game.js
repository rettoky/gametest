// Candy class
class Candy {
    constructor() {
        this.size = 20; // Candy size
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

// Add new variables for candies
let candies = [];

// Modify gameLoop function to handle candies
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
            if (collisionDetection(player, candy)) {
                score += 10; // Increase score by 10
                candies.splice(index, 1); // Remove candy after collision
            }
        });

        // Move enemies and candies off-screen and reset when needed
        enemies = enemies.filter(enemy => enemy.x + enemy.width > 0);
        candies = candies.filter(candy => candy.x + candy.size > 0);

        // Draw score
        ctx.fillStyle = COLORS.BLACK;
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);

        requestAnimationFrame(gameLoop);
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
}, 2000); // Change this interval as needed
