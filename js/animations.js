/**
 * Scroll Animations — IntersectionObserver-based reveal system
 * Handles all scroll-triggered animations and counters
 */
(function () {
  'use strict';

  // ── General Reveal Observer (threshold 0.15) ──
  // Handles: .reveal, .reveal-scale, .reveal-slide, .reveal-stagger,
  //          .reveal-title, .timeline-item, .section
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('visible');

        // Timeline items get 'active' class and unobserve (one-shot)
        if (el.classList.contains('timeline-item')) {
          el.classList.add('active');
          revealObserver.unobserve(el);
        }

        // Sections: set opacity (one-shot)
        if (el.classList.contains('section')) {
          el.style.opacity = '1';
          revealObserver.unobserve(el);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  // Observe all reveal elements
  document
    .querySelectorAll('.reveal, .reveal-scale, .reveal-slide, .reveal-stagger, .reveal-title')
    .forEach((el) => revealObserver.observe(el));

  // Observe timeline items
  document.querySelectorAll('.timeline-item').forEach((item) => revealObserver.observe(item));

  // Observe sections for clip-path reveal
  document.querySelectorAll('.section').forEach((section) => {
    revealObserver.observe(section);
  });

  // ── Staggered delays for grid items ──
  document.querySelectorAll('.skills-grid, .projects-grid, .education-grid, .contact-links').forEach((grid) => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // ── Counter Observer (threshold 0.5 — needs higher visibility) ──
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-number[data-count]').forEach((counter) => {
    counterObserver.observe(counter);
  });

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }
})();
