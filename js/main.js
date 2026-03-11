(function () {
  'use strict';

  const hasFineCursor = window.matchMedia('(pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const scrollProgress = document.getElementById('scroll-progress');
  const customCursor = document.getElementById('custom-cursor');

  const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'evidence', 'contact'];
  const navAnchors = {};
  const sectionOffsets = {};

  sectionIds.forEach(function (id) {
    const anchor = navLinks ? navLinks.querySelector('a[href="#' + id + '"]') : null;
    if (anchor) {
      navAnchors[id] = anchor;
    }
  });

  function recalculateSectionOffsets() {
    sectionIds.forEach(function (id) {
      const section = document.getElementById(id);
      if (section) {
        sectionOffsets[id] = section.offsetTop;
      }
    });
  }

  let scrollTicking = false;

  function onScrollFrame() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const scrollable = document.body.scrollHeight - windowHeight;

    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 24);
    }

    const threshold = scrollY + windowHeight * 0.35;
    let currentSection = '';

    sectionIds.forEach(function (id) {
      if (sectionOffsets[id] <= threshold) {
        currentSection = id;
      }
    });

    Object.values(navAnchors).forEach(function (anchor) {
      anchor.classList.remove('active');
    });

    if (currentSection && navAnchors[currentSection]) {
      navAnchors[currentSection].classList.add('active');
    }

    if (currentSection && navbar) {
      navbar.setAttribute('data-section', currentSection);
    }

    if (scrollProgress) {
      const progress = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }

    scrollTicking = false;
  }

  recalculateSectionOffsets();
  window.addEventListener('load', recalculateSectionOffsets);
  window.addEventListener('resize', function () {
    recalculateSectionOffsets();
    onScrollFrame();
  }, { passive: true });

  window.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(onScrollFrame);
  }, { passive: true });

  onScrollFrame();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    });
  });

  if (hasFineCursor && customCursor && !prefersReduced) {
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    let cursorFrame = null;
    let cursorReady = false;
    const idleThreshold = 0.5;
    const lerpFactor = 0.1;
    const hoverTargets = 'a, button, .btn, .case-study, [data-tilt], .tag, .skill-list li, .evidence-card';

    function renderCursor() {
      customCursor.style.transform =
        'translate3d(' + cursorX + 'px, ' + cursorY + 'px, 0) translate(-50%, -50%)';
    }

    function updateCursor() {
      cursorFrame = null;
      cursorX += (targetX - cursorX) * lerpFactor;
      cursorY += (targetY - cursorY) * lerpFactor;
      renderCursor();

      if (Math.abs(targetX - cursorX) < idleThreshold && Math.abs(targetY - cursorY) < idleThreshold) {
        cursorX = targetX;
        cursorY = targetY;
        renderCursor();
        return;
      }

      cursorFrame = requestAnimationFrame(updateCursor);
    }

    document.addEventListener('mousemove', function (event) {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!cursorReady) {
        cursorReady = true;
        cursorX = targetX;
        cursorY = targetY;
        renderCursor();
        return;
      }

      if (cursorFrame === null) {
        cursorFrame = requestAnimationFrame(updateCursor);
      }
    }, { passive: true });

    document.querySelectorAll(hoverTargets).forEach(function (element) {
      element.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-hover');
      });

      element.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  if (hasFineCursor && !prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.style.willChange = 'transform';
      });

      card.addEventListener('mousemove', function (event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform =
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      }, { passive: true });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';

        setTimeout(function () {
          card.style.transition = '';
          card.style.willChange = '';
        }, 450);
      });
    });
  }

  if (hasFineCursor && !prefersReduced) {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(function (element) {
      element.addEventListener('mousemove', function (event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = 'translate(' + x * 0.12 + 'px, ' + y * 0.12 + 'px)';
      }, { passive: true });

      element.addEventListener('mouseleave', function () {
        element.style.transform = '';
      });
    });
  }

  if (window.innerWidth <= 768 && navbar) {
    let lastScrollY = window.scrollY;
    let navHidden = false;
    let navFramePending = false;

    window.addEventListener('scroll', function () {
      if (navFramePending) return;
      navFramePending = true;

      requestAnimationFrame(function () {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;

        if (delta > 10 && currentY > 120 && !navHidden) {
          navbar.classList.add('nav-hidden');
          navHidden = true;
        } else if (delta < -6 && navHidden) {
          navbar.classList.remove('nav-hidden');
          navHidden = false;
        }

        lastScrollY = currentY;
        navFramePending = false;
      });
    }, { passive: true });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navToggle && navLinks && navLinks.classList.contains('open')) {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();
