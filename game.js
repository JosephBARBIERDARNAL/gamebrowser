const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let x = 50,
  y = 50;
const size = 50;
const speed = 5;

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move the square
  x += speed;
  if (x + size > canvas.width || x < 0) {
    speed *= -1;
  }

  // Draw the square
  ctx.fillRect(x, y, size, size);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
