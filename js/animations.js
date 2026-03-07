(function () {
  'use strict';

  const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-slide, .reveal-stagger');
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const timelineProgress = document.querySelector('.timeline-progress');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timeline = document.querySelector('.timeline');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            observer.unobserve(entry.target);
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

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

  if (timeline && timelineProgress) {
    const timelineObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    timelineItems.forEach((item) => timelineObserver.observe(item));

    let timelineScrollScheduled = false;
    function updateTimelineProgress() {
      const rect = timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.top < viewportHeight && rect.bottom > 0) {
        const totalHeight = rect.height;
        const scrolled = viewportHeight - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / totalHeight));
        timelineProgress.style.height = `${progress * 100}%`;
      }

      timelineScrollScheduled = false;
    }

    function onTimelineScroll() {
      if (!timelineScrollScheduled) {
        timelineScrollScheduled = true;
        requestAnimationFrame(updateTimelineProgress);
      }
    }

    window.addEventListener('scroll', onTimelineScroll, { passive: true });
    updateTimelineProgress();
  }
})();
