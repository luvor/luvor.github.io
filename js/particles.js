/**
 * Hero Canvas — Refined particle system
 * Luminous floating dots (no connections), cyan + violet palette
 * DPR-aware, visibility-paused, mouse-interactive
 */
(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animationId;
  let isVisible = true;

  // Config
  const CONFIG = {
    particleSize: { min: 1, max: 3 },
    speed: { min: 0.05, max: 0.3 },
    mouseRadius: 200,
    mouseRadiusSq: 200 * 200,
    mouseForce: 0.02,
    colors: [
      'rgba(0, 255, 224, ',    // cyan
      'rgba(167, 139, 250, ',  // violet
    ],
    particleOpacity: { min: 0.3, max: 0.9 },
    glowThreshold: 2,
    glowBlur: 8,
  };

  function getParticleCount() {
    if (prefersReduced) return 8;
    if (width < 480) return 12;
    if (width < 1024) return 20;
    return 60;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      const speed = CONFIG.speed.min + Math.random() * (CONFIG.speed.max - CONFIG.speed.min);
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = CONFIG.particleSize.min + Math.random() * (CONFIG.particleSize.max - CONFIG.particleSize.min);
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.opacity = CONFIG.particleOpacity.min + Math.random() * (CONFIG.particleOpacity.max - CONFIG.particleOpacity.min);
      this.pulseSpeed = 0.003 + Math.random() * 0.008;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.isGlow = this.size > CONFIG.glowThreshold;
    }

    update(time) {
      // Mouse interaction — squared distance check
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < CONFIG.mouseRadiusSq) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
        this.vx += dx * force;
        this.vy += dy * force;
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Speed limit
      const speedSq = this.vx * this.vx + this.vy * this.vy;
      const maxSpeedSq = CONFIG.speed.max * CONFIG.speed.max;
      if (speedSq > maxSpeedSq) {
        const speed = Math.sqrt(speedSq);
        this.vx = (this.vx / speed) * CONFIG.speed.max;
        this.vy = (this.vy / speed) * CONFIG.speed.max;
      }

      // Move
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;

      // Pulse opacity
      this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;
    }
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const count = getParticleCount();
    if (Math.abs(particles.length - count) > 5) {
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

  function animate(time) {
    if (!isVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Update all particles
    for (const p of particles) {
      p.update(time);
    }

    // Draw non-glow particles first (no shadowBlur state change)
    ctx.shadowBlur = 0;
    for (const p of particles) {
      if (p.isGlow) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.currentOpacity + ')';
      ctx.fill();
    }

    // Draw glow particles with subtle glow
    ctx.shadowBlur = CONFIG.glowBlur;
    for (const p of particles) {
      if (!p.isGlow) continue;
      ctx.shadowColor = p.color + '0.5)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.currentOpacity + ')';
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Mouse glow
    if (mouse.x > 0 && mouse.y > 0) {
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
      gradient.addColorStop(0, 'rgba(0, 255, 224, 0.04)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(mouse.x - 150, mouse.y - 150, 300, 300);
    }

    animationId = requestAnimationFrame(animate);
  }

  // Events
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

  // Init
  function init() {
    resize();
    initParticles();

    if (prefersReduced) {
      // Draw one static frame instead of animating
      animate(0);
      return;
    }

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
