(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealSelector = '.reveal, .reveal-title, .reveal-slide';

  function applyGridDelays() {
    ['.skills-grid', '.education-grid', '.projects-stack', '.contact-links'].forEach(function (selector) {
      const grid = document.querySelector(selector);
      if (!grid) return;

      Array.from(grid.children).forEach(function (child, index) {
        child.style.transitionDelay = index * 0.07 + 's';
      });
    });
  }

  function applyReducedMotionState() {
    document.querySelectorAll(revealSelector).forEach(function (element) {
      element.classList.add('visible');
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

        });
      },
      {
        threshold: [0.15],
        rootMargin: '0px 0px -50px 0px',
      }
    );

    document.querySelectorAll(revealSelector).forEach(function (element) {
      observer.observe(element);
    });
  }

  function init() {
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
