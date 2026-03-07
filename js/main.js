(function () {
  'use strict';

  const hasFineCursor = window.matchMedia('(pointer: fine)').matches;
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const scrollProgress = document.getElementById('scroll-progress');
  const timelineProgress = document.querySelector('.timeline-progress');
  const timeline = document.querySelector('.timeline');
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  const orbs = document.querySelectorAll('.orb');

  document.querySelectorAll('.skeleton-wrap').forEach(function (wrap) {
    var img = wrap.querySelector('img');
    if (!img) return;
    function onLoaded() { wrap.classList.add('loaded'); }
    if (img.complete && img.naturalWidth > 0) { onLoaded(); return; }
    img.addEventListener('load', onLoaded, { once: true });
    img.addEventListener('error', onLoaded, { once: true });
  });

  const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'gallery', 'contact'];
  const navAnchors = {};
  sectionIds.forEach((id) => {
    const anchor = navLinks?.querySelector(`a[href="#${id}"]`);
    if (anchor) navAnchors[id] = anchor;
  });

  const tabBar = document.getElementById('mobile-tab-bar');
  const tabItems = tabBar ? tabBar.querySelectorAll('.tab-item') : [];
  const tabSectionMap = {};
  tabItems.forEach((tab) => {
    const section = tab.dataset.section;
    if (section) tabSectionMap[section] = tab;
  });

  function updateActiveTab(current) {
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
    if (updateActiveTab.current === mapped) return;
    if (updateActiveTab.current && tabSectionMap[updateActiveTab.current]) {
      tabSectionMap[updateActiveTab.current].classList.remove('active');
    }
    if (tabSectionMap[mapped]) {
      tabSectionMap[mapped].classList.add('active');
      updateActiveTab.current = mapped;
    }
  }
  updateActiveTab.current = '';

  var fab = document.getElementById('context-fab');
  var fabIcon = fab ? fab.querySelector('.fab-icon') : null;
  var fabLabel = fab ? fab.querySelector('.fab-label') : null;
  var currentFabSection = '';
  var fabTransitionTimer = null;
  var fabLabelTimer = null;

  var fabIcons = {
    briefcase: '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    code: '<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    timeline: '<svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><circle cx="12" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="18" r="2"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    image: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    'arrow-up': '<svg viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  };

  var fabConfig = {
    hero:       { icon: 'briefcase', label: 'View Work',    target: 'projects',   glow: 'rgba(41,151,255,0.35)' },
    about:      { icon: 'code',      label: 'My Skills',    target: 'skills',     glow: 'rgba(41,151,255,0.35)' },
    skills:     { icon: 'timeline',   label: 'Experience',   target: 'experience', glow: 'rgba(41,151,255,0.35)' },
    experience: { icon: 'grid',       label: 'Projects',     target: 'projects',   glow: 'rgba(191,90,242,0.35)' },
    projects:   { icon: 'mail',       label: 'Get in Touch', target: 'contact',    glow: 'rgba(191,90,242,0.35)' },
    education:  { icon: 'image',      label: 'Gallery',      target: 'gallery',    glow: 'rgba(48,209,88,0.35)' },
    gallery:    { icon: 'mail',       label: 'Contact Me',   target: 'contact',    glow: 'rgba(48,209,88,0.35)' },
    contact:    { icon: 'arrow-up',   label: 'Back to Top',  target: 'hero',       glow: 'rgba(191,90,242,0.35)' },
  };

  function updateFab(sectionId) {
    if (!fab || !fabIcon || !fabLabel) return;
    if (sectionId === currentFabSection) return;
    var config = fabConfig[sectionId];
    if (!config) return;

    currentFabSection = sectionId;
    fab.setAttribute('data-section', sectionId);
    fab.setAttribute('aria-label', config.label);

    fab.classList.add('fab-transitioning');
    clearTimeout(fabTransitionTimer);
    fabTransitionTimer = setTimeout(function () {
      fabIcon.innerHTML = fabIcons[config.icon] || '';
      fabLabel.textContent = config.label;
      fab.style.setProperty('--fab-glow', config.glow);
      fab.classList.remove('fab-transitioning');
    }, 200);

    if (window.innerWidth <= 768) {
      clearTimeout(fabLabelTimer);
      fabLabel.classList.add('fab-label-visible');
      fabLabelTimer = setTimeout(function () {
        fabLabel.classList.remove('fab-label-visible');
      }, 2000);
    }
  }

  if (fab) {
    fab.addEventListener('click', function () {
      var config = fabConfig[currentFabSection];
      if (!config) return;
      var target = document.getElementById(config.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      if (typeof haptic === 'function') haptic('light');
      else if (navigator.vibrate) navigator.vibrate(10);
    });
    updateFab('hero');
  }

  function triggerHeroReveal() {
    const hero = document.querySelector('.hero');
    if (!hero || hero.classList.contains('loaded')) return;
    hero.classList.add('loaded');

    const body = document.body;

    body.classList.add('hero-revealed');

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

    const words = hero.querySelectorAll('.word-reveal');
    words.forEach((word, i) => {
      setTimeout(() => word.classList.add('visible'), 600 + i * 80);
    });

    setTimeout(() => {
      body.classList.remove('hero-load');
    }, 1500);
  }

  window.addEventListener('load', triggerHeroReveal);
  if (document.readyState === 'complete') triggerHeroReveal();

  let ticking = false;
  const sectionRefs = {};
  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionRefs[id] = section;
  });

  let activeNavAnchor = null;
  let timelineTop = 0;
  let timelineHeight = 0;
  let hasTimelineMetrics = false;
  const parallaxCache = Array.from(parallaxElements).map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0.1,
    baseTop: 0,
  }));

  function refreshScrollMetrics() {
    if (timeline) {
      const timelineRect = timeline.getBoundingClientRect();
      timelineTop = timelineRect.top + window.scrollY;
      timelineHeight = timeline.offsetHeight || 1;
      hasTimelineMetrics = timelineHeight > 0;
    }

    parallaxCache.forEach((item) => {
      item.baseTop = item.el.getBoundingClientRect().top + window.scrollY;
    });
  }

  window.addEventListener('resize', refreshScrollMetrics, { passive: true });
  window.addEventListener('load', refreshScrollMetrics);
  refreshScrollMetrics();

  function onScrollFrame() {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const windowH = window.innerHeight;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const threshold = scrollY + windowH / 3;
    let current = '';
    sectionIds.forEach((id) => {
      const section = sectionRefs[id];
      if (section && section.offsetTop <= threshold) {
        current = id;
      }
    });

    const currentAnchor = current ? navAnchors[current] : null;
    if (activeNavAnchor !== currentAnchor) {
      if (activeNavAnchor) activeNavAnchor.classList.remove('active');
      if (currentAnchor) currentAnchor.classList.add('active');
      activeNavAnchor = currentAnchor;
    }
    if (current) {
      navbar.setAttribute('data-section', current);
      updateActiveTab(current);
      updateFab(current);
    }

    if (scrollProgress) {
      const scrollable = docHeight - windowH;
      const progress = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }

    if (timeline && timelineProgress && hasTimelineMetrics) {
      const timelineViewportTop = timelineTop - scrollY;
      const timelineViewportBottom = timelineViewportTop + timelineHeight;
      if (timelineViewportTop < windowH && timelineViewportBottom > 0) {
        const scrolled = windowH - timelineViewportTop;
        const progress = Math.max(0, Math.min(1, scrolled / timelineHeight));
        timelineProgress.style.height = (progress * 100) + '%';
      }
    }

    if (parallaxCache.length > 0) {
      const center = windowH / 2;
      parallaxCache.forEach(({ el, speed, baseTop }) => {
        const offset = (baseTop - scrollY - center) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }

    if (orbs.length > 0) {
      orbs.forEach((orb, i) => {
        const speed = 0.03 + i * 0.01;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (scrollProgress) {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const windowH = window.innerHeight;
      const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const scrollable = docHeight - windowH;
      const progress = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });

  onScrollFrame();

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
      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(updateGlow);
    }

    updateGlow();
  }

  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (hasFineCursor) {
    tiltCards.forEach((card) => {
      let tiltRaf = 0;
      let lastMouseEvent = null;

      function applyTilt() {
        if (!lastMouseEvent) {
          tiltRaf = 0;
          return;
        }
        const rect = card.getBoundingClientRect();
        const x = lastMouseEvent.clientX - rect.left;
        const y = lastMouseEvent.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        tiltRaf = 0;
      }

      card.addEventListener('mousemove', (e) => {
        lastMouseEvent = e;
        if (!tiltRaf) tiltRaf = requestAnimationFrame(applyTilt);
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

  document.querySelectorAll('.skill-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const dot = item.querySelector('.skill-dot');
      if (dot) {
        dot.style.transform = 'scale(1.5)';
        setTimeout(() => { dot.style.transform = ''; }, 300);
      }
    });
  });

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
