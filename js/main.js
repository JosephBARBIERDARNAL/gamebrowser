import {
  drawBullets,
  drawEnemies,
  drawScore,
  drawLives,
  drawPlayer,
  drawExplosions,
} from "./draw.js";
import { updateExplosions, createExplosion } from "./explosion.js";
import { bulletSpeed, enemySpawnRate, enemySpeed } from "./settings.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

export const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  lives: 10,
  width: 50,
  height: 50,
  speed: 6,
};

const bullets = [];
const enemies = [];
const explosions = [];
let score = 0;

let frameCount = 0;
let paused = false;

let fadingOut = false;
let fadeOpacity = 0;

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
      createExplosion(
        explosions,
        enemies[i].x + enemies[i].width / 2,
        enemies[i].y + enemies[i].height / 2
      );
      enemies.splice(i, 1);
      player.lives -= 1;
      if (player.lives <= 0) {
        startFadeOut();
      }
    }
  }
}

function startFadeOut() {
  fadingOut = true;
  const fadeInterval = setInterval(() => {
    if (fadeOpacity < 1) {
      fadeOpacity += 0.05;
    } else {
      clearInterval(fadeInterval);
      document.location.reload();
    }
  }, 20);
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
        createExplosion(
          explosions,
          enemies[i].x + enemies[i].width / 2,
          enemies[i].y + enemies[i].height / 2
        );
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        break;
      }
    }
  }
}

function update(player, bulletSpeed, enemySpawnRate, enemySpeed) {
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

  updateExplosions(explosions);
  checkCollisions();
  frameCount++;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer(ctx, player);
  drawBullets(ctx, bullets);
  drawEnemies(ctx, enemies);
  drawExplosions(ctx, explosions);
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

  if (fadingOut) {
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function gameLoop() {
  if (!paused) {
    update(player, bulletSpeed, enemySpawnRate, enemySpeed);
    checkPlayerCollisions();
    render();
  } else {
    render();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
