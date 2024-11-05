const playerSprite = new Image();
playerSprite.src = "img/joseph.png";

export function drawBullets(ctx, bullets) {
  bullets.forEach((bullet) => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(
      bullet.x - bullet.width / 2,
      bullet.y,
      bullet.width,
      bullet.height
    );
  });
}

export function drawEnemies(ctx, enemies) {
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

export function drawScore(ctx, score) {
  ctx.fillStyle = "#000000";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

export function drawPlayer(ctx, player) {
  if (playerSprite.complete) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(
      player.x + player.width / 2, // center x
      player.y + player.height / 2, // center y
      player.width / 2, // radius (half width for circle)
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
      playerSprite,
      player.x,
      player.y,
      player.width,
      player.height
    );

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#FFD700"; // Example border color
    ctx.stroke();

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;

    ctx.restore();
  } else {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
}

export function drawLives(ctx, canvas, player) {
  ctx.fillStyle = "#000000";
  ctx.font = "20px Arial";
  ctx.fillText(`Lives: ${player.lives}`, canvas.width - 100, 30);
}