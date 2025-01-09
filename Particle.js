document.addEventListener('DOMContentLoaded', () => {
  // Canvas setup
  const canvas = document.getElementById('c');
  const context = canvas.getContext('2d');
  if (!canvas || !context) {
    console.error('Canvas element or context not found.');
    return;
  }

  // Resize canvas to fit window
  let width, height;
  const resizeCanvas = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle configuration
  const MAX_DISTANCE = 300;
  const PARTICLES = 25;
  const PARTICLE_SIZE = 5;

  // Utilities
  Math.Tau = Math.PI * 2;
  Math.rand = (min, max) => Math.random() * (max - min) + min;

  // Particle class
  class Particle {
    constructor(x, y, size, color) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.radius = size / 2;
      this.vx = (Math.random() < 0.5 ? -1 : 1) * Math.rand(0.5, 2);
      this.vy = (Math.random() < 0.5 ? -1 : 1) * Math.rand(0.5, 2);
      this.color = color;
    }

    distance(other) {
      return Math.hypot(this.x - other.x, this.y - other.y);
    }

    step() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < this.radius || this.x > width - this.radius) this.vx *= -1;
      if (this.y < this.radius || this.y > height - this.radius) this.vy *= -1;
    }

    render() {
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.Tau);
      context.closePath();
      context.fill();
    }
  }

  // Initialize particles
  const particles = [];
  for (let i = 0; i < PARTICLES; i++) {
    particles.push(
      new Particle(
        Math.random() * width,
        Math.random() * height,
        PARTICLE_SIZE,
        'rgba(200, 200, 200, 1)'
      )
    );
  }

  // Mouse particle
  const mouseParticle = new Particle(0, 0, PARTICLE_SIZE * 2, 'rgba(50, 200, 90, 1)');
  let hover = false;

  canvas.addEventListener('mouseenter', () => (hover = true));
  canvas.addEventListener('mouseleave', () => (hover = false));
  canvas.addEventListener('mousemove', (event) => {
    if (hover) {
      mouseParticle.x = event.clientX;
      mouseParticle.y = event.clientY;
    }
  });

  particles.push(mouseParticle);

  // Render loop
  const render = () => {
    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    context.fillRect(0, 0, width, height);

    // Update and draw particles
    for (let p1 of particles) {
      p1.step();
      p1.render();

      for (let p2 of particles) {
        if (p1 === p2) continue;

        const distance = p1.distance(p2);
        if (distance < MAX_DISTANCE) {
          const alpha = 1 - distance / MAX_DISTANCE;
          context.strokeStyle = `rgba(200, 200, 200, ${alpha})`;
          context.beginPath();
          context.moveTo(p1.x, p1.y);
          context.lineTo(p2.x, p2.y);
          context.closePath();
          context.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  };

  // Start rendering
  render();
});
