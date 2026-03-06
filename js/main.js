/**
 * Main — Navigation, tilt effects, cursor glow, smooth scroll,
 *        unified scroll handler, parallax, timeline progress
 */
(function () {
  'use strict';

  // ── Cached queries ──
  const hasFineCursor = window.matchMedia('(pointer: fine)').matches;
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const scrollProgress = document.getElementById('scroll-progress');
  const timelineProgress = document.querySelector('.timeline-progress');
  const timeline = document.querySelector('.timeline');
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  const orbs = document.querySelectorAll('.orb');

  const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'gallery', 'contact'];
  const navAnchors = {};
  sectionIds.forEach((id) => {
    const anchor = navLinks?.querySelector(`a[href="#${id}"]`);
    if (anchor) navAnchors[id] = anchor;
  });

  // ── Mobile Tab Bar ──
  const tabBar = document.getElementById('mobile-tab-bar');
  const tabItems = tabBar ? tabBar.querySelectorAll('.tab-item') : [];
  const tabSectionMap = {};
  tabItems.forEach((tab) => {
    const section = tab.dataset.section;
    if (section) tabSectionMap[section] = tab;
  });

  function updateActiveTab(current) {
    tabItems.forEach((tab) => tab.classList.remove('active'));
    // Map sections to nearest tab
    const tabMapping = {
      'hero': 'hero',
      'about': 'about',
      'skills': 'about',
      'experience': 'projects',
      'projects': 'projects',
      'education': 'projects',
      'gallery': 'gallery',
      'contact': 'contact',
    };
    const mapped = tabMapping[current] || current;
    if (tabSectionMap[mapped]) {
      tabSectionMap[mapped].classList.add('active');
    }
  }

  // ── Orchestrated page load sequence ──
  function triggerHeroReveal() {
    const hero = document.querySelector('.hero');
    if (!hero || hero.classList.contains('loaded')) return;
    hero.classList.add('loaded');

    const body = document.body;

    // Step 1: Switch from hero-load to hero-revealed (enables transitions)
    body.classList.add('hero-revealed');

    // Step 2: Staggered reveals
    const delays = {
      '.navbar': 0,
      '.hero-badge': 300,
      '.hero-title': 400,
      '.hero-subtitle': 550,
      '.hero-actions': 700,
      '.hero-visual': 500,
      '#hero-canvas': 900,
      '.hero-scroll-indicator': 1200,
    };

    Object.entries(delays).forEach(([selector, delay]) => {
      const el = document.querySelector(selector);
      if (el) {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }, delay);
      }
    });

    // Step 3: Word reveals (existing behavior)
    const words = hero.querySelectorAll('.word-reveal');
    words.forEach((word, i) => {
      setTimeout(() => word.classList.add('visible'), 600 + i * 80);
    });

    // Step 4: Remove hero-load class after all animations complete
    setTimeout(() => {
      body.classList.remove('hero-load');
    }, 1500);
  }

  window.addEventListener('load', triggerHeroReveal);
  if (document.readyState === 'complete') triggerHeroReveal();

  // ══════════════════════════════════════════════
  //  UNIFIED SCROLL HANDLER (RAF-throttled)
  // ══════════════════════════════════════════════
  let ticking = false;

  function onScrollFrame() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const docHeight = document.body.scrollHeight;

    // 1. Navbar scroll state
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 2. Active nav link + section-aware tinting (merged)
    const threshold = scrollY + windowH / 3;
    let current = '';
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= threshold) {
        current = id;
      }
    });

    Object.values(navAnchors).forEach((a) => a.classList.remove('active'));
    if (current && navAnchors[current]) {
      navAnchors[current].classList.add('active');
    }
    if (current) {
      navbar.setAttribute('data-section', current);
      updateActiveTab(current);
    }

    // 3. Scroll progress bar
    if (scrollProgress) {
      const scrollable = docHeight - windowH;
      const progress = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }

    // 4. Timeline progress
    if (timeline && timelineProgress) {
      const rect = timeline.getBoundingClientRect();
      if (rect.top < windowH && rect.bottom > 0) {
        const scrolled = windowH - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / rect.height));
        timelineProgress.style.height = (progress * 100) + '%';
      }
    }

    // 5. Parallax
    if (parallaxElements.length > 0) {
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrollY - windowH / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }

    // 6. Ambient orbs scroll-linked shift
    if (orbs.length > 0) {
      orbs.forEach((orb, i) => {
        const speed = 0.03 + i * 0.01;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });

  // Initial call
  onScrollFrame();

  // ── Mobile nav toggle ──
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Tab bar click handling ──
  if (tabBar) {
    tabBar.querySelectorAll('.tab-item').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const href = tab.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          const navHeight = navbar.offsetHeight;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - navHeight,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }
    });
  });

  // ── Cursor glow follow ──
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorGlow && hasFineCursor) {
    let glowX = 0, glowY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    }, { passive: true });

    function updateGlow() {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(updateGlow);
    }

    updateGlow();
  }

  // ── 3D Tilt effect on project cards ──
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (hasFineCursor) {
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  // ── Magnetic effect on buttons ──
  if (hasFineCursor) {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      }, { passive: true });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ── Skill items hover ripple ──
  document.querySelectorAll('.skill-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const dot = item.querySelector('.skill-dot');
      if (dot) {
        dot.style.transform = 'scale(1.5)';
        setTimeout(() => { dot.style.transform = ''; }, 300);
      }
    });
  });

  // ── Hero photo spotlight + 3D tilt ──
  const heroImageWrapper = document.querySelector('.hero-image-wrapper');
  const heroSection = document.querySelector('.hero');

  if (heroImageWrapper && hasFineCursor) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroImageWrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroImageWrapper.style.setProperty('--spot-x', x + '%');
      heroImageWrapper.style.setProperty('--spot-y', y + '%');

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / rect.width) * 8;
      const rotateX = ((e.clientY - centerY) / rect.height) * -8;
      heroImageWrapper.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      heroImageWrapper.style.transform = '';
      heroImageWrapper.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { heroImageWrapper.style.transition = ''; }, 500);
    });
  }

  // ── Card spotlight effect (Apple-style) ──
  if (hasFineCursor) {
    document
      .querySelectorAll('.skill-category, .timeline-card, .education-card, .contact-card, .stat')
      .forEach((card) => {
        card.classList.add('glass-spotlight');
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--glow-x', x + '%');
          card.style.setProperty('--glow-y', y + '%');
        }, { passive: true });
      });
  }

  // ── Gallery Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  const lightboxCounter = lightbox?.querySelector('.lightbox-counter');
  const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
  let lightboxIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !galleryImages[index]) return;
    lightboxIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
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
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${galleryImages.length}`;
  }

  galleryImages.forEach((img, i) => {
    img.closest('.gallery-item')?.addEventListener('click', () => openLightbox(i));
  });

  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
  lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => navigateLightbox(1));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // ── Keyboard navigation ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox?.classList.contains('active')) {
        closeLightbox();
      } else if (navLinks?.classList.contains('open')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
    if (lightbox?.classList.contains('active')) {
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });

})();
