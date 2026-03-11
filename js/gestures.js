(function () {
  'use strict';

  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function haptic(style) {
    if (!navigator.vibrate) return;

    const patterns = {
      light: [8],
      medium: [15],
      heavy: [25],
    };

    navigator.vibrate(patterns[style] || patterns.light);
  }

  function showToast(message, duration) {
    const timeout = duration || 3000;
    const existing = document.querySelector('.toast-notification');
    if (existing) {
      existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('visible');
    });

    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () {
        toast.remove();
      }, 400);
    }, timeout);
  }

  function setupPullToRefresh() {
    if (!isMobile) return;

    const pullIndicator = document.createElement('div');
    pullIndicator.className = 'pull-refresh-indicator';
    pullIndicator.innerHTML =
      '<div class="pull-refresh-logo">IC</div><span class="pull-refresh-text">You found an easter egg!</span>';
    document.body.appendChild(pullIndicator);

    let startY = 0;
    let pulling = false;
    let triggered = false;

    document.addEventListener('touchstart', function (event) {
      if (window.scrollY > 0 || event.touches.length !== 1) return;

      startY = event.touches[0].clientY;
      pulling = true;
      triggered = false;
    }, { passive: true });

    document.addEventListener('touchmove', function (event) {
      if (!pulling) return;

      const currentY = event.touches[0].clientY;
      const distance = (currentY - startY) * 0.4;
      if (distance <= 0 || window.scrollY > 0) return;

      pullIndicator.style.transform =
        'translateX(-50%) translateY(' + Math.min(distance, 120) + 'px)';
      pullIndicator.style.opacity = String(Math.min(distance / 80, 1));

      const logo = pullIndicator.querySelector('.pull-refresh-logo');
      if (logo && !prefersReduced) {
        logo.style.transform = 'rotate(' + distance * 3 + 'deg)';
      }

      if (distance > 80 && !triggered) {
        triggered = true;
        haptic('medium');
        pullIndicator.classList.add('triggered');
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
        const logo = pullIndicator.querySelector('.pull-refresh-logo');
        pullIndicator.style.transform = 'translateX(-50%) translateY(-100px)';
        pullIndicator.style.opacity = '0';
        pullIndicator.classList.remove('triggered', 'releasing');

        if (logo) {
          logo.style.transform = '';
        }
      }, triggered ? 600 : 200);
    }, { passive: true });
  }

  function setupGyroscope() {
    if (!isMobile || prefersReduced) return;

    const heroPhoto = document.querySelector('.photo-reveal');
    if (!heroPhoto) return;

    function handleOrientation(event) {
      const gamma = event.gamma || 0;
      const beta = event.beta || 0;

      const x = Math.max(-1, Math.min(1, gamma / 30)) * 10;
      const y = Math.max(-1, Math.min(1, (beta - 45) / 30)) * 10;

      heroPhoto.style.transform =
        'perspective(800px) rotateY(' + x * 0.3 + 'deg) rotateX(' + -y * 0.3 + 'deg)';
    }

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      let requested = false;

      document.addEventListener('touchstart', function requestGyro() {
        if (requested) return;
        requested = true;

        DeviceOrientationEvent.requestPermission()
          .then(function (state) {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, { passive: true });
            }
          })
          .catch(function () {});
      }, { once: true });
    } else if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
  }

  function setupShakeDetection() {
    if (!isMobile) return;

    const shakeThreshold = 15;
    const shakeTimeout = 1000;
    let shakes = [];
    let lastShakeTime = 0;

    window.addEventListener('devicemotion', function (event) {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const force = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);
      if (force <= shakeThreshold + 9.8) return;

      const now = Date.now();
      if (now - lastShakeTime <= 250) return;

      lastShakeTime = now;
      shakes.push(now);
      shakes = shakes.filter(function (timestamp) {
        return now - timestamp < shakeTimeout;
      });

      if (shakes.length < 3) return;

      shakes = [];
      haptic('heavy');

      const contact = document.getElementById('contact');
      if (!contact) return;

      contact.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      showToast('Shook up? Let\'s talk!');
    }, { passive: true });
  }

  function setupLightboxGestures() {
    if (!isMobile) return;

    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    let touchStartX = 0;
    let touchStartY = 0;

    lightbox.addEventListener('touchstart', function (event) {
      if (event.touches.length !== 1) return;

      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (event) {
      if (event.changedTouches.length !== 1) return;

      const dx = event.changedTouches[0].clientX - touchStartX;
      const dy = event.changedTouches[0].clientY - touchStartY;

      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) {
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');

        if (dx > 0 && prevButton) {
          prevButton.click();
        } else if (dx < 0 && nextButton) {
          nextButton.click();
        }

        haptic('light');
        return;
      }

      if (Math.abs(dy) > 100 && Math.abs(dy) > Math.abs(dx) * 2) {
        const closeButton = lightbox.querySelector('.lightbox-close');
        if (closeButton) {
          closeButton.click();
        }
      }
    }, { passive: true });
  }

  function setupLongPress() {
    if (!isMobile) return;

    const heroPhoto = document.querySelector('.photo-reveal');
    if (!heroPhoto) return;

    let pressTimer = null;

    heroPhoto.addEventListener('touchstart', function () {
      pressTimer = setTimeout(function () {
        haptic('medium');
        if (!prefersReduced) {
          heroPhoto.classList.add('spin-reveal');
        }
        showToast('Built with nothing but vanilla JS');

        setTimeout(function () {
          heroPhoto.classList.remove('spin-reveal');
        }, 1000);
      }, 500);
    }, { passive: true });

    function clearPressTimer() {
      clearTimeout(pressTimer);
      pressTimer = null;
    }

    heroPhoto.addEventListener('touchend', clearPressTimer, { passive: true });
    heroPhoto.addEventListener('touchmove', clearPressTimer, { passive: true });
    heroPhoto.addEventListener('touchcancel', clearPressTimer, { passive: true });
  }

  function setupNavbarAutoHide() {
    if (window.innerWidth > 768) return;

    const nav = document.getElementById('navbar');
    if (!nav) return;

    let lastScrollY = window.scrollY;
    let navHidden = false;
    let scrollFramePending = false;

    window.addEventListener('scroll', function () {
      if (scrollFramePending) return;
      scrollFramePending = true;

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
        scrollFramePending = false;
      });
    }, { passive: true });
  }

  function init() {
    setupPullToRefresh();
    setupGyroscope();
    setupShakeDetection();
    setupLongPress();
    setupLightboxGestures();
    setupNavbarAutoHide();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
