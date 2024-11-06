const n_particles = 50;
const size_reduction_rate = 0.05;
const scale = 3;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 2;
    this.speedX = Math.random() * 2 * scale - scale;
    this.speedY = Math.random() * 2 * scale - scale;
    this.color = `hsl(${Math.random() * 60 + 10}, 100%, 50%)`;
    this.life = 1; // Life value from 1 to 0
    this.decay = Math.random() * 0.02 + 0.02;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.size = Math.max(0, this.size - size_reduction_rate);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 10);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export function createExplosion(explosions, x, y) {
  for (let i = 0; i < n_particles; i++) {
    explosions.push(new Particle(x, y));
  }
}

export function updateExplosions(explosions) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].update();
    if (explosions[i].life <= 0) {
      explosions.splice(i, 1);
    }
  }
}
