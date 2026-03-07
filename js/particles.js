(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let isVisible = true;

  const CONFIG = {
    particleCount: 80,
    maxDistance: 150,
    particleSize: { min: 1, max: 2.5 },
    speed: { min: 0.1, max: 0.4 },
    mouseRadius: 200,
    mouseForce: 0.02,
    colors: [
      'rgba(41, 151, 255, ',
      'rgba(191, 90, 242, ',
      'rgba(48, 209, 88, ',
    ],
    lineOpacity: 0.15,
    particleOpacity: { min: 0.3, max: 0.8 },
  };
  const maxDistanceSq = CONFIG.maxDistance * CONFIG.maxDistance;

  function getParticleCount() {
    if (width < 480) return 30;
    if (width < 768) return 50;
    return CONFIG.particleCount;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * CONFIG.speed.max * 2;
      this.vy = (Math.random() - 0.5) * CONFIG.speed.max * 2;
      this.size = CONFIG.particleSize.min + Math.random() * (CONFIG.particleSize.max - CONFIG.particleSize.min);
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.opacity = CONFIG.particleOpacity.min + Math.random() * (CONFIG.particleOpacity.max - CONFIG.particleOpacity.min);
      this.pulseSpeed = 0.005 + Math.random() * 0.01;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < CONFIG.mouseRadius * CONFIG.mouseRadius) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
        this.vx += dx * force;
        this.vy += dy * force;
      }

      this.vx *= 0.99;
      this.vy *= 0.99;

      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > CONFIG.speed.max) {
        this.vx = (this.vx / speed) * CONFIG.speed.max;
        this.vy = (this.vy / speed) * CONFIG.speed.max;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;

      this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.currentOpacity + ')';
      ctx.fill();
    }
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = getParticleCount();
    if (Math.abs(particles.length - count) > 10) {
      initParticles();
    }
  }

  function initParticles() {
    const count = getParticleCount();
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const cells = new Map();
    const cellSize = CONFIG.maxDistance;

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      const cellX = Math.floor(particle.x / cellSize);
      const cellY = Math.floor(particle.y / cellSize);
      const key = `${cellX},${cellY}`;
      const bucket = cells.get(key);

      if (bucket) {
        bucket.push(i);
      } else {
        cells.set(key, [i]);
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      const cellX = Math.floor(particle.x / cellSize);
      const cellY = Math.floor(particle.y / cellSize);

      for (let offsetX = -1; offsetX <= 1; offsetX++) {
        for (let offsetY = -1; offsetY <= 1; offsetY++) {
          const bucket = cells.get(`${cellX + offsetX},${cellY + offsetY}`);
          if (!bucket) {
            continue;
          }

          for (const j of bucket) {
            if (j <= i) {
              continue;
            }

            const otherParticle = particles[j];
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistanceSq) {
              const dist = Math.sqrt(distSq);
              const opacity = (1 - dist / CONFIG.maxDistance) * CONFIG.lineOpacity;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(41, 151, 255, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }
    }
  }

  function animate(time) {
    if (!isVisible) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.update(time);
      p.draw();
    }

    drawConnections();

    if (mouse.x > 0 && mouse.y > 0) {
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
      gradient.addColorStop(0, 'rgba(41, 151, 255, 0.03)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(mouse.x - 150, mouse.y - 150, 300, 300);
    }

    requestAnimationFrame(animate);
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function onMouseLeave() {
    mouse.x = -1000;
    mouse.y = -1000;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  }

  function onVisibilityChange() {
    isVisible = !document.hidden;
  }

  function init() {
    resize();
    initParticles();
    animate(0);

    window.addEventListener('resize', resize, { passive: true });
    canvas.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', onMouseLeave, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
