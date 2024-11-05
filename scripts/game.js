import {
  drawBullets,
  drawEnemies,
  drawScore,
  drawLives,
  drawPlayer,
} from "./draw.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  lives: 3,
  width: 50,
  height: 50,
  speed: 10,
  color: "#00ff00",
};

const bullets = [];
const enemies = [];
let score = 0;

const bulletSpeed = 10;
const enemySpeed = 1;
const enemySpawnRate = 60;
let frameCount = 0;
let paused = false;

const keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

document.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "P") {
    paused = !paused;
  }
});

function checkPlayerCollisions() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (
      player.x < enemies[i].x + enemies[i].width &&
      player.x + player.width > enemies[i].x &&
      player.y < enemies[i].y + enemies[i].height &&
      player.y + player.height > enemies[i].y
    ) {
      enemies.splice(i, 1); // Remove the enemy
      player.lives -= 1; // Decrease player lives
      if (player.lives <= 0) {
        alert("Looser! Game Over!");
        document.location.reload();
      }
    }
  }
}

function createBullet() {
  bullets.push({
    x: player.x + player.width / 2,
    y: player.y,
    width: 4,
    height: 10,
    color: "#f25050",
  });
}

function createEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 30),
    y: 0,
    width: 30,
    height: 30,
    color: "#ff0000",
  });
}

function checkCollisions() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (
        bullets[j].x < enemies[i].x + enemies[i].width &&
        bullets[j].x + bullets[j].width > enemies[i].x &&
        bullets[j].y < enemies[i].y + enemies[i].height &&
        bullets[j].y + bullets[j].height > enemies[i].y
      ) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        break;
      }
    }
  }
}

function update() {
  // Player movement
  if (keys["ArrowDown"] && player.y < canvas.height - player.height)
    player.y += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width)
    player.x += player.speed;

  if (keys[" "]) {
    if (frameCount % 10 === 0) createBullet();
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bulletSpeed;
    if (bullets[i].y < 0) bullets.splice(i, 1);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += enemySpeed;
    if (enemies[i].y > canvas.height) enemies.splice(i, 1);
  }

  if (frameCount % enemySpawnRate === 0) {
    createEnemy();
  }

  checkCollisions();
  frameCount++;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer(ctx, player);
  drawBullets(ctx, bullets);
  drawEnemies(ctx, enemies);
  drawScore(ctx, score);
  drawLives(ctx, canvas, player);
  if (paused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Paused", canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  if (!paused) {
    update();
    checkPlayerCollisions();
    render();
  } else {
    // Render only the paused overlay if the game is paused
    render();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
