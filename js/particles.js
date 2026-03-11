(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = null;
  let isVisible = !document.hidden;
  let mouseGlow = null;
  let mouseGlowDirty = true;
  const mouse = { x: -1000, y: -1000 };

  const CONFIG = {
    particleSize: { min: 1, max: 3 },
    speed: { min: 0.05, max: 0.3 },
    mouseRadius: 200,
    mouseRadiusSq: 200 * 200,
    mouseForce: 0.02,
    colors: [
      'rgba(0, 255, 224, ',
      'rgba(167, 139, 250, ',
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
      this.currentOpacity = 1;
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
      this.opacity =
        CONFIG.particleOpacity.min +
        Math.random() * (CONFIG.particleOpacity.max - CONFIG.particleOpacity.min);
      this.currentOpacity = this.opacity;
      this.pulseSpeed = 0.003 + Math.random() * 0.008;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.isGlow = this.size > CONFIG.glowThreshold;
    }

    update(time) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < CONFIG.mouseRadiusSq) {
        const distance = Math.sqrt(distanceSquared);
        const force = (1 - distance / CONFIG.mouseRadius) * CONFIG.mouseForce;
        this.vx += dx * force;
        this.vy += dy * force;
      }

      this.vx *= 0.99;
      this.vy *= 0.99;

      const speedSquared = this.vx * this.vx + this.vy * this.vy;
      const maxSpeedSquared = CONFIG.speed.max * CONFIG.speed.max;

      if (speedSquared > maxSpeedSquared) {
        const speed = Math.sqrt(speedSquared);
        this.vx = (this.vx / speed) * CONFIG.speed.max;
        this.vy = (this.vy / speed) * CONFIG.speed.max;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;

      this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;
    }
  }

  function initParticles() {
    particles = [];

    for (let index = 0; index < getParticleCount(); index += 1) {
      particles.push(new Particle());
    }
  }

  function getMouseGlow() {
    if (!mouseGlowDirty) {
      return mouseGlow;
    }

    mouseGlowDirty = false;

    if (mouse.x <= 0 || mouse.y <= 0) {
      mouseGlow = null;
      return mouseGlow;
    }

    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
    gradient.addColorStop(0, 'rgba(0, 255, 224, 0.04)');
    gradient.addColorStop(1, 'transparent');
    mouseGlow = gradient;

    return mouseGlow;
  }

  function drawFrame(time, shouldUpdateParticles) {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(function (particle) {
      if (shouldUpdateParticles) {
        particle.update(time);
      } else {
        particle.currentOpacity = particle.opacity;
      }
    });

    ctx.shadowBlur = 0;
    particles.forEach(function (particle) {
      if (particle.isGlow) return;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color + particle.currentOpacity + ')';
      ctx.fill();
    });

    ctx.shadowBlur = CONFIG.glowBlur;
    particles.forEach(function (particle) {
      if (!particle.isGlow) return;

      ctx.shadowColor = particle.color + '0.5)';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color + particle.currentOpacity + ')';
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    const glow = getMouseGlow();
    if (glow) {
      ctx.fillStyle = glow;
      ctx.fillRect(mouse.x - 150, mouse.y - 150, 300, 300);
    }
  }

  function animate(time) {
    if (!isVisible) {
      animationId = null;
      return;
    }

    drawFrame(time, true);
    animationId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (prefersReduced || animationId !== null || !isVisible) return;
    animationId = requestAnimationFrame(animate);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (particles.length !== getParticleCount()) {
      initParticles();
    }

    mouseGlowDirty = true;
    drawFrame(prefersReduced ? 0 : performance.now(), !prefersReduced && isVisible);
  }

  function onMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouseGlowDirty = true;
  }

  function onMouseLeave() {
    mouse.x = -1000;
    mouse.y = -1000;
    mouseGlowDirty = true;
  }

  function onTouchMove(event) {
    if (!event.touches.length) return;

    const rect = canvas.getBoundingClientRect();
    mouse.x = event.touches[0].clientX - rect.left;
    mouse.y = event.touches[0].clientY - rect.top;
    mouseGlowDirty = true;
  }

  function onVisibilityChange() {
    isVisible = !document.hidden;

    if (isVisible) {
      if (prefersReduced) {
        drawFrame(0, false);
      } else {
        startAnimation();
      }
    }
  }

  function init() {
    initParticles();
    resize();

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (prefersReduced) {
      drawFrame(0, false);
      return;
    }

    canvas.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', onMouseLeave, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onMouseLeave, { passive: true });

    startAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
