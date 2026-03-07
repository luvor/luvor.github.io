(function () {
  'use strict';

  const hero = document.querySelector('.hero');
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const sectionIds = ['about', 'skills', 'experience', 'projects', 'education', 'contact'];
  const navAnchors = {};

  function markHeroLoaded() {
    hero?.classList.add('loaded');
  }

  window.addEventListener('load', markHeroLoaded, { once: true });
  if (document.readyState === 'complete') {
    markHeroLoaded();
  }

  function updateActiveNav() {
    const scrollY = window.scrollY + window.innerHeight / 3;
    let current = '';

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= scrollY) {
        current = id;
      }
    });

    Object.values(navAnchors).forEach((anchor) => anchor.classList.remove('active'));
    if (current) {
      navAnchors[current]?.classList.add('active');
    }
  }

  let scrollScheduled = false;
  function syncScrollState() {
    const scrollY = window.scrollY;
    navbar?.classList.toggle('scrolled', scrollY > 50);
    updateActiveNav();
    scrollScheduled = false;
  }

  function onScroll() {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(syncScrollState);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  sectionIds.forEach((id) => {
    const anchor = navLinks?.querySelector(`a[href="#${id}"]`);
    if (anchor) {
      navAnchors[id] = anchor;
    }
  });
  syncScrollState();

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

  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let glowX = 0;
    let glowY = 0;
    let targetX = 0;
    let targetY = 0;
    let glowFrame = 0;

    function updateGlow() {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;

      if (Math.abs(targetX - glowX) > 0.1 || Math.abs(targetY - glowY) > 0.1) {
        glowFrame = requestAnimationFrame(updateGlow);
      } else {
        glowFrame = 0;
      }
    }

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!glowFrame) {
        glowFrame = requestAnimationFrame(updateGlow);
      }
    }, { passive: true });
  }

  const tiltCards = document.querySelectorAll('[data-tilt]');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer) {
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

  const magneticElements = document.querySelectorAll('.btn-primary, .btn-ghost');
  if (finePointer) {
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

  document.querySelectorAll('.skill-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const dot = item.querySelector('.skill-dot');
      if (dot) {
        dot.style.transform = 'scale(1.5)';
        setTimeout(() => { dot.style.transform = ''; }, 300);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks?.classList.contains('open')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

})();
