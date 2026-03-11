(function () {
  'use strict';

  const hasFineCursor = window.matchMedia('(pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const scrollProgress = document.getElementById('scroll-progress');
  const customCursor = document.getElementById('custom-cursor');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxCounter = lightbox ? lightbox.querySelector('.lightbox-counter') : null;

  const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'gallery', 'contact'];
  const navAnchors = {};
  const sectionOffsets = {};

  sectionIds.forEach(function (id) {
    const anchor = navLinks ? navLinks.querySelector('a[href="#' + id + '"]') : null;
    if (anchor) {
      navAnchors[id] = anchor;
    }
  });

  const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
  let lightboxIndex = 0;

  // --- Skeleton loading ---
  document.querySelectorAll('.skeleton-wrap').forEach(function (wrap) {
    const img = wrap.querySelector('img');
    if (!img) return;

    function onLoaded() {
      wrap.classList.add('loaded');
    }

    if (img.complete && img.naturalWidth > 0) {
      onLoaded();
      return;
    }

    img.addEventListener('load', onLoaded, { once: true });
    img.addEventListener('error', onLoaded, { once: true });
  });

  // --- Hero reveal ---
  function triggerHeroReveal() {
    const body = document.body;
    if (body.classList.contains('hero-revealed')) return;

    body.classList.add('hero-revealed');

    const delays = {
      '.navbar': 0,
      '.hero-badge': 300,
      '.hero-name': 400,
      '.hero-subtitle': 600,
      '.hero-actions': 800,
      '#hero-canvas': 500,
      '.scroll-indicator': 1200,
    };

    Object.keys(delays).forEach(function (selector) {
      const element = document.querySelector(selector);
      if (!element) return;

      setTimeout(function () {
        element.style.opacity = '1';
        element.style.transform = 'none';
      }, delays[selector]);
    });

    setTimeout(function () {
      document.querySelectorAll('.char-stagger').forEach(function (element) {
        element.classList.add('revealed');
      });
    }, 500);

    setTimeout(function () {
      body.classList.remove('hero-load');
    }, 1500);
  }

  window.addEventListener('load', triggerHeroReveal);
  if (document.readyState === 'complete') {
    triggerHeroReveal();
  }

  // --- Cached section offsets ---
  function recalculateSectionOffsets() {
    sectionIds.forEach(function (id) {
      const section = document.getElementById(id);
      if (section) {
        sectionOffsets[id] = section.offsetTop;
      }
    });
  }

  recalculateSectionOffsets();
  window.addEventListener('resize', function () {
    recalculateSectionOffsets();
    onScrollFrame();
  }, { passive: true });
  window.addEventListener('load', recalculateSectionOffsets);

  // --- Scroll state ---
  let scrollTicking = false;

  function onScrollFrame() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const scrollable = document.body.scrollHeight - windowHeight;

    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 50);
    }

    const threshold = scrollY + windowHeight / 3;
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

  window.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(onScrollFrame);
  }, { passive: true });

  onScrollFrame();

  // --- Mobile navigation ---
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

  // --- Smooth scroll ---
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

  // --- Custom cursor ---
  if (hasFineCursor && customCursor && !prefersReduced) {
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    let cursorFrame = null;
    let cursorReady = false;
    const lerpFactor = 0.1;
    const idleThreshold = 0.5;

    const hoverTargets = 'a, button, .btn, .gallery-item, .project-card, [data-tilt], .tag, .skill-list li';

    function renderCursor() {
      customCursor.style.transform =
        'translate3d(' + cursorX + 'px, ' + cursorY + 'px, 0) translate(-50%, -50%)';
    }

    function updateCursor() {
      cursorFrame = null;

      cursorX += (targetX - cursorX) * lerpFactor;
      cursorY += (targetY - cursorY) * lerpFactor;
      renderCursor();

      const deltaX = Math.abs(targetX - cursorX);
      const deltaY = Math.abs(targetY - cursorY);

      if (deltaX < idleThreshold && deltaY < idleThreshold) {
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

  // --- Gallery lightbox ---
  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !lightboxCounter || !galleryImages[index]) return;

    lightboxIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    lightboxCounter.textContent = (index + 1) + ' / ' + galleryImages.length;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    if (!lightboxImg || !lightboxCounter || !galleryImages.length) return;

    lightboxIndex = (lightboxIndex + direction + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[lightboxIndex].src;
    lightboxImg.alt = galleryImages[lightboxIndex].alt;
    lightboxCounter.textContent = (lightboxIndex + 1) + ' / ' + galleryImages.length;
  }

  galleryImages.forEach(function (img, index) {
    const item = img.closest('.gallery-item');
    if (!item) return;

    item.addEventListener('click', function () {
      openLightbox(index);
    });

    item.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openLightbox(index);
    });
  });

  if (lightbox) {
    const closeButton = lightbox.querySelector('.lightbox-close');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');

    if (closeButton) {
      closeButton.addEventListener('click', closeLightbox);
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        navigateLightbox(-1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        navigateLightbox(1);
      });
    }

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // --- Tilted project cards ---
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

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform =
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      }, { passive: true });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

        setTimeout(function () {
          card.style.transition = '';
          card.style.willChange = '';
        }, 500);
      });
    });
  }

  // --- Magnetic buttons ---
  if (hasFineCursor && !prefersReduced) {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(function (element) {
      element.addEventListener('mousemove', function (event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      }, { passive: true });

      element.addEventListener('mouseleave', function () {
        element.style.transform = '';
      });
    });
  }

  // --- Keyboard support ---
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      } else if (navToggle && navLinks && navLinks.classList.contains('open')) {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }

    if (lightbox && lightbox.classList.contains('active')) {
      if (event.key === 'ArrowLeft') navigateLightbox(-1);
      if (event.key === 'ArrowRight') navigateLightbox(1);
    }
  });
})();
