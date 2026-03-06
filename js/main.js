/**
 * Main — Navigation, tilt effects, cursor glow, smooth scroll
 */
(function () {
  'use strict';

  // ── Hero loaded state + word reveal ──
  function triggerHeroReveal() {
    const hero = document.querySelector('.hero');
    if (!hero || hero.classList.contains('loaded')) return;
    hero.classList.add('loaded');

    // Staggered word reveal on subtitle
    const words = hero.querySelectorAll('.word-reveal');
    words.forEach((word, i) => {
      setTimeout(() => word.classList.add('visible'), 600 + i * 80);
    });
  }

  window.addEventListener('load', triggerHeroReveal);
  if (document.readyState === 'complete') triggerHeroReveal();

  // ── Navbar scroll state ──
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav toggle ──
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
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

  // ── Active nav link on scroll ──
  const sectionIds = ['about', 'skills', 'experience', 'projects', 'education', 'gallery', 'contact'];
  const navAnchors = {};

  sectionIds.forEach((id) => {
    const anchor = navLinks?.querySelector(`a[href="#${id}"]`);
    if (anchor) navAnchors[id] = anchor;
  });

  function updateActiveNav() {
    const scrollY = window.scrollY + window.innerHeight / 3;

    let current = '';
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= scrollY) {
        current = id;
      }
    });

    Object.values(navAnchors).forEach((a) => a.classList.remove('active'));
    if (current && navAnchors[current]) {
      navAnchors[current].classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ── Cursor glow follow ──
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
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

  if (window.matchMedia('(pointer: fine)').matches) {
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
  const magneticElements = document.querySelectorAll('.btn-primary, .btn-ghost');

  if (window.matchMedia('(pointer: fine)').matches) {
    magneticElements.forEach((el) => {
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

  if (heroImageWrapper && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroImageWrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroImageWrapper.style.setProperty('--spot-x', x + '%');
      heroImageWrapper.style.setProperty('--spot-y', y + '%');

      // Subtle 3D tilt
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
  const spotlightCards = document.querySelectorAll('.skill-category, .timeline-card, .education-card, .contact-card, .stat');

  if (window.matchMedia('(pointer: fine)').matches) {
    spotlightCards.forEach((card) => {
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

  // ── Section-aware nav tinting ──
  function updateNavSection() {
    const scrollY = window.scrollY + window.innerHeight / 3;
    let current = '';
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= scrollY) current = id;
    });
    if (current) navbar.setAttribute('data-section', current);
  }
  window.addEventListener('scroll', updateNavSection, { passive: true });

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

  // ── Keyboard navigation enhancement ──
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
