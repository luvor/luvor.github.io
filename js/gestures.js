/**
 * Gesture Engine — Touch interactions, device sensors, easter eggs
 * Mobile-first features with coarse pointer detection
 */
(function () {
  'use strict';

  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Haptic Feedback ──
  function haptic(style) {
    if (!navigator.vibrate) return;
    const patterns = { light: [8], medium: [15], heavy: [25] };
    navigator.vibrate(patterns[style] || patterns.light);
  }

  // ── Toast Notification ──
  function showToast(message, duration) {
    duration = duration || 3000;
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('visible');
    });

    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () { toast.remove(); }, 400);
    }, duration);
  }

  // ── Pull-to-Refresh Easter Egg ──
  function setupPullToRefresh() {
    if (!isMobile) return;

    const pullIndicator = document.createElement('div');
    pullIndicator.className = 'pull-refresh-indicator';
    pullIndicator.innerHTML = '<div class="pull-refresh-logo">IC</div><span class="pull-refresh-text">You found an easter egg!</span>';
    document.body.appendChild(pullIndicator);

    let startY = 0;
    let pulling = false;
    let triggered = false;

    document.addEventListener('touchstart', function (e) {
      if (window.scrollY <= 0 && e.touches.length === 1) {
        startY = e.touches[0].clientY;
        pulling = true;
        triggered = false;
      }
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (!pulling) return;
      const currentY = e.touches[0].clientY;
      const distance = (currentY - startY) * 0.4;

      if (distance > 0 && window.scrollY <= 0) {
        pullIndicator.style.transform = 'translateX(-50%) translateY(' + Math.min(distance, 120) + 'px)';
        pullIndicator.style.opacity = Math.min(distance / 80, 1);

        const logo = pullIndicator.querySelector('.pull-refresh-logo');
        if (logo) logo.style.transform = 'rotate(' + (distance * 3) + 'deg)';

        if (distance > 80 && !triggered) {
          triggered = true;
          haptic('medium');
          pullIndicator.classList.add('triggered');
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', function () {
      if (!pulling) return;
      pulling = false;

      if (triggered) {
        showToast('You found an easter egg! Built with pure vanilla JS');
        pullIndicator.classList.add('releasing');
      }

      setTimeout(function () {
        pullIndicator.style.transform = 'translateX(-50%) translateY(-100px)';
        pullIndicator.style.opacity = '0';
        pullIndicator.classList.remove('triggered', 'releasing');
      }, triggered ? 600 : 200);
    }, { passive: true });
  }

  // ── Gyroscope Parallax ──
  function setupGyroscope() {
    if (!isMobile || prefersReduced) return;

    const heroPhoto = document.querySelector('.photo-reveal');

    function handleOrientation(e) {
      const gamma = e.gamma || 0;
      const beta = e.beta || 0;

      const x = Math.max(-1, Math.min(1, gamma / 30)) * 10;
      const y = Math.max(-1, Math.min(1, (beta - 45) / 30)) * 10;

      if (heroPhoto) {
        heroPhoto.style.transform = 'perspective(800px) rotateY(' + (x * 0.3) + 'deg) rotateX(' + (-y * 0.3) + 'deg)';
      }
    }

    // iOS 13+ requires permission
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      let requested = false;
      document.addEventListener('touchstart', function requestGyro() {
        if (requested) return;
        requested = true;
        DeviceOrientationEvent.requestPermission().then(function (state) {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
          }
        }).catch(function () {});
      }, { once: true });
    } else if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
  }

  // ── Shake to Contact ──
  function setupShakeDetection() {
    if (!isMobile) return;

    const shakeThreshold = 15;
    const shakeTimeout = 1000;
    let shakes = [];
    let lastShakeTime = 0;

    window.addEventListener('devicemotion', function (e) {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

      if (force > shakeThreshold + 9.8) {
        const now = Date.now();
        if (now - lastShakeTime > 250) {
          lastShakeTime = now;
          shakes.push(now);

          // Keep only recent shakes
          shakes = shakes.filter(function (t) { return now - t < shakeTimeout; });

          if (shakes.length >= 3) {
            shakes = [];
            haptic('heavy');

            const contact = document.getElementById('contact');
            if (contact) {
              contact.scrollIntoView({ behavior: 'smooth' });
              showToast("Shook up? Let's talk!");
            }
          }
        }
      }
    }, { passive: true });
  }

  // ── Lightbox Swipe Gestures ──
  function setupLightboxGestures() {
    if (!isMobile) return;

    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    let touchStartX = 0;
    let touchStartY = 0;
    const img = lightbox.querySelector('.lightbox-img');

    lightbox.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      if (e.changedTouches.length !== 1) return;

      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) {
        // Horizontal swipe — navigate
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        if (dx > 0 && prevBtn) prevBtn.click();
        else if (dx < 0 && nextBtn) nextBtn.click();
        haptic('light');
      } else if (Math.abs(dy) > 100 && Math.abs(dy) > Math.abs(dx) * 2) {
        // Vertical swipe — dismiss
        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.click();
      }
    }, { passive: true });
  }

  // ── Long Press Hero Photo ──
  function setupLongPress() {
    if (!isMobile) return;

    const heroPhoto = document.querySelector('.photo-reveal');
    if (!heroPhoto) return;

    let pressTimer = null;

    heroPhoto.addEventListener('touchstart', function () {
      pressTimer = setTimeout(function () {
        haptic('medium');
        heroPhoto.classList.add('spin-reveal');
        showToast('Built with nothing but vanilla JS');

        setTimeout(function () {
          heroPhoto.classList.remove('spin-reveal');
        }, 1000);
      }, 500);
    }, { passive: true });

    heroPhoto.addEventListener('touchend', function () {
      clearTimeout(pressTimer);
    }, { passive: true });

    heroPhoto.addEventListener('touchmove', function () {
      clearTimeout(pressTimer);
    }, { passive: true });
  }

  // ── Konami Code (Swipe Pattern) ──
  function setupKonamiCode() {
    if (!isMobile) return;

    const pattern = ['up', 'up', 'down', 'down', 'left', 'right'];
    let current = [];
    let startX, startY;

    document.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const minSwipe = 50;

      let direction = null;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > minSwipe) direction = dx > 0 ? 'right' : 'left';
      } else {
        if (Math.abs(dy) > minSwipe) direction = dy > 0 ? 'down' : 'up';
      }

      if (direction) {
        current.push(direction);
        if (current.length > pattern.length) current.shift();

        if (current.length === pattern.length &&
            current.every(function (d, i) { return d === pattern[i]; })) {
          current = [];
          activatePartyMode();
        }
      }
    }, { passive: true });
  }

  function activatePartyMode() {
    haptic('heavy');
    document.body.classList.add('party-mode');
    showToast('PARTY MODE ACTIVATED!');

    // Pulse gradient-text colors faster — CSS class handles the animation
    setTimeout(function () {
      document.body.classList.remove('party-mode');
    }, 5000);
  }

  // ── Experience Card Collapse (mobile) ──
  function setupExperienceCollapse() {
    if (window.innerWidth > 768) return;

    document.querySelectorAll('.experience-card').forEach(function (card) {
      const desc = card.querySelector('.experience-desc');
      const tags = card.querySelector('.experience-tags');
      if (!desc) return;

      card.classList.add('collapsed');

      card.addEventListener('click', function () {
        const wasCollapsed = card.classList.contains('collapsed');

        // Collapse all others
        document.querySelectorAll('.experience-card.expanded').forEach(function (c) {
          c.classList.remove('expanded');
          c.classList.add('collapsed');
        });

        if (wasCollapsed) {
          card.classList.remove('collapsed');
          card.classList.add('expanded');
          haptic('light');
        }
      });
    });
  }

  // ── Navbar Auto-Hide on Mobile ──
  function setupNavbarAutoHide() {
    if (window.innerWidth > 768) return;

    const nav = document.getElementById('navbar');
    if (!nav) return;

    let lastScrollY = window.scrollY;
    let navHidden = false;
    let rafTicking = false;

    window.addEventListener('scroll', function () {
      if (rafTicking) return;
      rafTicking = true;

      requestAnimationFrame(function () {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;

        if (delta > 10 && currentY > 100 && !navHidden) {
          nav.classList.add('nav-hidden');
          navHidden = true;
        } else if (delta < -5 && navHidden) {
          nav.classList.remove('nav-hidden');
          navHidden = false;
        }

        lastScrollY = currentY;
        rafTicking = false;
      });
    }, { passive: true });
  }

  // ── Init ──
  function init() {
    setupPullToRefresh();
    setupGyroscope();
    setupShakeDetection();
    setupLongPress();
    setupKonamiCode();
    setupLightboxGestures();
    setupExperienceCollapse();
    setupNavbarAutoHide();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
