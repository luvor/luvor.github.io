/**
 * Hero Canvas — Particle network animation
 * Creates an interactive particle system with connections
 * Optimized with spatial hashing and squared-distance checks
 */
(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animationId;
  let isVisible = true;

  // Config
  const CONFIG = {
    particleCount: 120,
    maxDistance: 180,
    maxDistanceSq: 180 * 180, // pre-computed squared
    particleSize: { min: 1.5, max: 4 },
    speed: { min: 0.1, max: 0.4 },
    mouseRadius: 200,
    mouseRadiusSq: 200 * 200,
    mouseForce: 0.02,
    colors: [
      'rgba(41, 151, 255, ',   // blue
      'rgba(191, 90, 242, ',   // purple
      'rgba(48, 209, 88, ',    // green
    ],
    lineOpacity: 0.25,
    particleOpacity: { min: 0.4, max: 1.0 },
  };

  // Adjust particle count for mobile (reduced for PWA performance)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isMobileDevice = window.matchMedia('(pointer: coarse)').matches;

  function getParticleCount() {
    if (width < 480) return isStandalone ? 12 : 20;
    if (width < 768) return isStandalone ? 20 : 35;
    return CONFIG.particleCount;
  }

  // Skip connections on mobile for performance
  const skipConnections = isMobileDevice;

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
      this.isGlow = this.size > 2.5;
    }

    update(time) {
      // Mouse interaction — use squared distance
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
      this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.2;
    }
  }

  // ── Spatial Grid for O(n) connection checks ──
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

  function drawConnections() {
    buildGrid();

    const maxDistSq = CONFIG.maxDistanceSq;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const cellIdx = row * gridCols + col;
        const cell = grid[cellIdx];
        if (cell.length === 0) continue;

        // Check same cell + right + bottom + bottom-right + bottom-left (avoid double-checking)
        const neighbors = [
          cellIdx,                                      // same cell
          col + 1 < gridCols ? cellIdx + 1 : -1,       // right
          row + 1 < gridRows ? cellIdx + gridCols : -1, // bottom
          col + 1 < gridCols && row + 1 < gridRows ? cellIdx + gridCols + 1 : -1, // bottom-right
          col - 1 >= 0 && row + 1 < gridRows ? cellIdx + gridCols - 1 : -1,       // bottom-left
        ];

        for (let ci = 0; ci < cell.length; ci++) {
          const pi = cell[ci];
          const a = particles[pi];

          for (let ni = 0; ni < neighbors.length; ni++) {
            const neighborIdx = neighbors[ni];
            if (neighborIdx === -1) continue;

            const neighborCell = grid[neighborIdx];
            // For same cell, start from ci+1 to avoid duplicate pairs
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
    ctx.scale(dpr, dpr);

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

    // Draw glow particles with single shadowBlur set
    ctx.shadowBlur = 12;
    for (const p of particles) {
      if (!p.isGlow) continue;
      ctx.shadowColor = p.color + '0.6)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.currentOpacity + ')';
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    if (!skipConnections) drawConnections();

    // Mouse glow
    if (mouse.x > 0 && mouse.y > 0) {
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
      gradient.addColorStop(0, 'rgba(41, 151, 255, 0.06)');
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
