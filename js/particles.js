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

  const CONFIG = {
    particleSize: { min: 1, max: 3 },
    speed: { min: 0.05, max: 0.3 },
    particleCount: 120,
    maxDistance: 180,
    maxDistanceSq: 180 * 180,
    particleSize: { min: 1.5, max: 4 },
    speed: { min: 0.1, max: 0.4 },
    mouseRadius: 200,
    mouseRadiusSq: 200 * 200,
    mouseForce: 0.02,
    colors: [
      'rgba(0, 255, 224, ',    // cyan
      'rgba(167, 139, 250, ',  // violet
      'rgba(41, 151, 255, ',
      'rgba(191, 90, 242, ',
      'rgba(48, 209, 88, ',
    ],
    particleOpacity: { min: 0.3, max: 0.9 },
    glowThreshold: 2,
    glowBlur: 8,
  };

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isMobileDevice = window.matchMedia('(pointer: coarse)').matches;

  function getParticleCount() {
    if (prefersReduced) return 8;
    if (width < 480) return 12;
    if (width < 1024) return 20;
    return 60;
  }

  const skipConnections = isMobileDevice;

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

      this.vx *= 0.99;
      this.vy *= 0.99;

      const speedSq = this.vx * this.vx + this.vy * this.vy;
      const maxSpeedSq = CONFIG.speed.max * CONFIG.speed.max;
      if (speedSq > maxSpeedSq) {
        const speed = Math.sqrt(speedSq);
        this.vx = (this.vx / speed) * CONFIG.speed.max;
        this.vy = (this.vy / speed) * CONFIG.speed.max;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;

      // Pulse opacity
      this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;
      this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.2;
    }
  }

  const cellSize = CONFIG.maxDistance;
  let gridCols, gridRows;
  let grid;

  function buildGrid() {
    gridCols = Math.ceil(width / cellSize) + 1;
    gridRows = Math.ceil(height / cellSize) + 1;
    grid = new Array(gridCols * gridRows);

    for (let i = 0; i < grid.length; i++) {
      grid[i] = [];
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const col = Math.floor(p.x / cellSize);
      const row = Math.floor(p.y / cellSize);
      if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
        grid[row * gridCols + col].push(i);
      }
    }
  }

  const neighborOffsets = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, 1],
  ];

  function drawConnections() {
    buildGrid();

    const maxDistSq = CONFIG.maxDistanceSq;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const cellIdx = row * gridCols + col;
        const cell = grid[cellIdx];
        if (cell.length === 0) continue;

        for (let ci = 0; ci < cell.length; ci++) {
          const pi = cell[ci];
          const a = particles[pi];

          for (let ni = 0; ni < neighborOffsets.length; ni++) {
            const offset = neighborOffsets[ni];
            const neighborCol = col + offset[0];
            const neighborRow = row + offset[1];
            if (neighborCol < 0 || neighborCol >= gridCols || neighborRow < 0 || neighborRow >= gridRows) continue;

            const neighborIdx = neighborRow * gridCols + neighborCol;
            const neighborCell = grid[neighborIdx];
            const startJ = neighborIdx === cellIdx ? ci + 1 : 0;

            for (let j = startJ; j < neighborCell.length; j++) {
              const pj = neighborCell[j];
              const b = particles[pj];

              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const distSq = dx * dx + dy * dy;

              if (distSq < maxDistSq) {
                const dist = Math.sqrt(distSq);
                const opacity = (1 - dist / CONFIG.maxDistance) * CONFIG.lineOpacity;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = a.color + opacity + ')';
                ctx.lineWidth = 0.8;
                ctx.stroke();
              }
            }
          }
        }
      }
    }
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
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

    for (const p of particles) {
      p.update(time);
    }

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
    ctx.shadowBlur = 12;
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
    if (!skipConnections) drawConnections();

    if (mouse.x > 0 && mouse.y > 0) {
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
      gradient.addColorStop(0, 'rgba(0, 255, 224, 0.04)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(mouse.x - 150, mouse.y - 150, 300, 300);
    }

    animationId = requestAnimationFrame(animate);
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
