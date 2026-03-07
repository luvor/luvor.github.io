/**
 * Main — Navigation, scroll handling, cursor, lightbox, tilt, interactions
 * Unified scroll handler with RAF throttling
 */
(function () {
  'use strict';

  const hasFineCursor = window.matchMedia('(pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Cached DOM queries ──
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
  sectionIds.forEach(function (id) {
    const anchor = navLinks ? navLinks.querySelector('a[href="#' + id + '"]') : null;
    if (anchor) navAnchors[id] = anchor;
  });

  const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
  let lightboxIndex = 0;

  // ══════════════════════════════════════════════
  //  1. SKELETON LOADING
  // ══════════════════════════════════════════════
  document.querySelectorAll('.skeleton-wrap').forEach(function (wrap) {
    const img = wrap.querySelector('img');
    if (!img) return;

    function onLoaded() { wrap.classList.add('loaded'); }

    if (img.complete && img.naturalWidth > 0) {
      onLoaded();
      return;
    }
    img.addEventListener('load', onLoaded, { once: true });
    img.addEventListener('error', onLoaded, { once: true });
  });

  // ══════════════════════════════════════════════
  //  2. PAGE LOAD SEQUENCE
  // ══════════════════════════════════════════════
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
      const el = document.querySelector(selector);
      if (el) {
        setTimeout(function () {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }, delays[selector]);
      }
    });

    // Trigger char-stagger reveals after 500ms
    setTimeout(function () {
      document.querySelectorAll('.char-stagger').forEach(function (el) {
        el.classList.add('revealed');
      });
    }, 500);

    // Remove hero-load class after all animations complete
    setTimeout(function () {
      body.classList.remove('hero-load');
    }, 1500);
  }

  window.addEventListener('load', triggerHeroReveal);
  if (document.readyState === 'complete') triggerHeroReveal();

  // ══════════════════════════════════════════════
  //  3. UNIFIED SCROLL HANDLER (RAF-throttled)
  // ══════════════════════════════════════════════
  let ticking = false;

  function onScrollFrame() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const docHeight = document.body.scrollHeight;

    // Navbar scroll state
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active nav link highlight
    const threshold = scrollY + windowH / 3;
    let current = '';
    sectionIds.forEach(function (id) {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= threshold) {
        current = id;
      }
    });

    Object.values(navAnchors).forEach(function (a) { a.classList.remove('active'); });
    if (current && navAnchors[current]) {
      navAnchors[current].classList.add('active');
    }
    if (current && navbar) {
      navbar.setAttribute('data-section', current);
    }

    // Scroll progress bar
    if (scrollProgress) {
      const scrollable = docHeight - windowH;
      const progress = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });

  // Initial call
  onScrollFrame();

  // ══════════════════════════════════════════════
  //  4. MOBILE NAV TOGGLE
  // ══════════════════════════════════════════════
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ══════════════════════════════════════════════
  //  5. SMOOTH SCROLL
  // ══════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: prefersReduced ? 'auto' : 'smooth',
        });
      }
    });
  });

  // ══════════════════════════════════════════════
  //  6. CUSTOM CURSOR (desktop only)
  // ══════════════════════════════════════════════
  if (hasFineCursor && customCursor && !prefersReduced) {
    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;
    const lerpFactor = 0.1;

    const hoverTargets = 'a, button, .btn, .gallery-item, .project-card, [data-tilt], .tag, .skill-list li';

    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
    }, { passive: true });

    // Hover detection
    document.querySelectorAll(hoverTargets).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-hover');
      });
    });

    function updateCursor() {
      cursorX += (targetX - cursorX) * lerpFactor;
      cursorY += (targetY - cursorY) * lerpFactor;
      customCursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';
      requestAnimationFrame(updateCursor);
    }

    updateCursor();
  }

  // ══════════════════════════════════════════════
  //  7. GALLERY LIGHTBOX
  // ══════════════════════════════════════════════
  function openLightbox(index) {
    if (!lightbox || !galleryImages[index]) return;
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

  function navigateLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[lightboxIndex].src;
    lightboxImg.alt = galleryImages[lightboxIndex].alt;
    lightboxCounter.textContent = (lightboxIndex + 1) + ' / ' + galleryImages.length;
  }

  // Click/keyboard on gallery items
  galleryImages.forEach(function (img, i) {
    const item = img.closest('.gallery-item');
    if (!item) return;

    item.addEventListener('click', function () { openLightbox(i); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  // Lightbox controls
  if (lightbox) {
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { navigateLightbox(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { navigateLightbox(1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // ══════════════════════════════════════════════
  //  8. 3D TILT ON PROJECT CARDS (desktop only)
  // ══════════════════════════════════════════════
  if (hasFineCursor && !prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      }, { passive: true });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

        setTimeout(function () {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  // ══════════════════════════════════════════════
  //  9. MAGNETIC BUTTONS (desktop only)
  // ══════════════════════════════════════════════
  if (hasFineCursor && !prefersReduced) {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      }, { passive: true });

      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  // ══════════════════════════════════════════════
  //  10. KEYBOARD NAVIGATION
  // ══════════════════════════════════════════════
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      // Close lightbox first, then mobile nav
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      } else if (navLinks && navLinks.classList.contains('open')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    // Lightbox arrow navigation
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });

})();
