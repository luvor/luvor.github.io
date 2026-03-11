(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealSelector = '.reveal, .reveal-title, .reveal-slide';

  function splitCharStaggers() {
    document.querySelectorAll('.char-stagger').forEach(function (element) {
      if (element.dataset.split === 'true') return;

      const text = element.dataset.text || element.textContent || '';
      const delay = prefersReduced ? 0 : 30;

      element.dataset.split = 'true';
      element.setAttribute('aria-label', text);
      element.textContent = '';

      for (let index = 0; index < text.length; index += 1) {
        const span = document.createElement('span');
        span.textContent = text[index] === ' ' ? '\u00A0' : text[index];
        span.style.transitionDelay = index * delay + 'ms';
        element.appendChild(span);
      }
    });
  }

  function animateCounter(element) {
    const target = parseInt(element.dataset.count || '0', 10);
    if (prefersReduced) {
      element.textContent = String(target);
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = String(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = String(target);
      }
    }

    requestAnimationFrame(update);
  }

  function applyGridDelays() {
    ['.skills-grid', '.education-grid', '.projects-stack', '.contact-links'].forEach(function (selector) {
      const grid = document.querySelector(selector);
      if (!grid) return;

      Array.from(grid.children).forEach(function (child, index) {
        child.style.transitionDelay = index * 0.08 + 's';
      });
    });
  }

  function setupObserver() {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const element = entry.target;
          const ratio = entry.intersectionRatio;

          if (element.matches(revealSelector) && ratio >= 0.15) {
            element.classList.add('visible');
            observer.unobserve(element);
            return;
          }

          if (element.classList.contains('char-stagger') && ratio >= 0.15) {
            element.classList.add('revealed');
            observer.unobserve(element);
            return;
          }

          if (element.classList.contains('photo-reveal') && ratio >= 0.3) {
            element.classList.add('revealed');
            observer.unobserve(element);
            return;
          }

          if (element.matches('.stat-number[data-count]') && ratio >= 0.5) {
            if (!element.dataset.animated) {
              element.dataset.animated = 'true';
              animateCounter(element);
            }
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: [0.15, 0.3, 0.5],
        rootMargin: '0px 0px -50px 0px',
      }
    );

    document.querySelectorAll(revealSelector).forEach(function (element) {
      observer.observe(element);
    });

    document.querySelectorAll('.char-stagger, .photo-reveal, .stat-number[data-count]').forEach(function (element) {
      observer.observe(element);
    });
  }

  function applyReducedMotionState() {
    document.querySelectorAll(revealSelector).forEach(function (element) {
      element.classList.add('visible');
    });

    document.querySelectorAll('.char-stagger').forEach(function (element) {
      element.classList.add('revealed');
    });

    document.querySelectorAll('.photo-reveal').forEach(function (element) {
      element.classList.add('revealed');
    });

    document.querySelectorAll('.stat-number[data-count]').forEach(function (element) {
      element.dataset.animated = 'true';
      element.textContent = element.dataset.count || element.textContent;
    });
  }

  function init() {
    splitCharStaggers();
    applyGridDelays();

    if (prefersReduced) {
      applyReducedMotionState();
      return;
    }

    setupObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
