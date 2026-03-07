/**
 * Animations — IntersectionObserver-based reveals, counters, char staggers
 * All scroll-triggered animations with prefers-reduced-motion respect
 */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFineCursor = window.matchMedia('(pointer: fine)').matches;

  // ── 1. Character stagger setup ──
  document.addEventListener('DOMContentLoaded', function () {
    const staggerEls = document.querySelectorAll('.char-stagger');

    staggerEls.forEach(function (el) {
      const text = el.textContent;
      const delay = prefersReduced ? 0 : 30;

      // Set aria-label for accessibility
      el.setAttribute('aria-label', text);
      el.innerHTML = '';

      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        span.style.transitionDelay = (i * delay) + 'ms';
        el.appendChild(span);
      }
    });
  });

  // ── 2. Reveal observer (threshold 0.15) ──
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('visible');

        // One-shot: unobserve after revealing
        if (el.classList.contains('reveal') ||
            el.classList.contains('reveal-title') ||
            el.classList.contains('reveal-slide') ||
            el.classList.contains('section')) {
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
    .querySelectorAll('.reveal, .reveal-title, .reveal-slide')
    .forEach(function (el) { revealObserver.observe(el); });

  // Observe sections
  document.querySelectorAll('.section').forEach(function (section) {
    revealObserver.observe(section);
  });

  // ── 3. Character stagger reveal observer ──
  const charStaggerObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        charStaggerObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  document.querySelectorAll('.char-stagger').forEach(function (el) {
    charStaggerObserver.observe(el);
  });

  // ── 4. Photo reveal observer ──
  const photoRevealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        photoRevealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.photo-reveal').forEach(function (el) {
    photoRevealObserver.observe(el);
  });

  // ── 5. Flip counter observer ──
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (entry.target.dataset.animated) return;

        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-number[data-count]').forEach(function (counter) {
    counterObserver.observe(counter);
  });

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-quart
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    if (prefersReduced) {
      el.textContent = target;
    } else {
      requestAnimationFrame(update);
    }
  }

  // ── 6. Stagger delays for grids ──
  const gridSelectors = ['.skills-grid', '.education-grid', '.projects-stack', '.contact-links'];

  gridSelectors.forEach(function (selector) {
    const grid = document.querySelector(selector);
    if (!grid) return;

    Array.from(grid.children).forEach(function (child, i) {
      child.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  // ── 7. Skills dim effect (desktop only) ──
  if (hasFineCursor) {
    const skillGroups = document.querySelectorAll('.skill-group');

    skillGroups.forEach(function (group) {
      group.addEventListener('mouseenter', function () {
        skillGroups.forEach(function (other) {
          if (other !== group) {
            other.classList.add('skill-dimmed');
          }
        });
      });

      group.addEventListener('mouseleave', function () {
        skillGroups.forEach(function (other) {
          other.classList.remove('skill-dimmed');
        });
      });
    });
  }
})();
