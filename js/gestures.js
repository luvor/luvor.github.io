/**
 * Gesture Engine — Touch interactions, spring physics, device sensors, easter eggs
 * Mobile-first: only activates on coarse pointer devices
 */
(function () {
  'use strict';

  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // ── Spring Physics ──
  function springValue(current, target, velocity, stiffness, damping) {
    stiffness = stiffness || 180;
    damping = damping || 12;
    const force = -stiffness * (current - target);
    const dampForce = -damping * velocity;
    const acceleration = force + dampForce;
    velocity += acceleration * (1 / 60);
    current += velocity * (1 / 60);
    return { value: current, velocity: velocity };
  }

  // ── Haptic Feedback ──
  function haptic(style) {
    if (!navigator.vibrate) return;
    var patterns = { light: [8], medium: [15], heavy: [25] };
    navigator.vibrate(patterns[style] || patterns.light);
  }

  // ── Toast Notification ──
  function showToast(message, duration) {
    duration = duration || 3000;
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    var toast = document.createElement('div');
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

  // ── Carousel Dot Indicators ──
  function setupCarouselDots() {
    var carousels = document.querySelectorAll('.gallery-grid, .projects-grid.bento');

    carousels.forEach(function (carousel) {
      if (window.innerWidth > 768) return;

      var items = carousel.children;
      if (items.length < 2) return;

      var dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
      if (dotsContainer) return; // already set up

      dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-dots';

      for (var i = 0; i < items.length; i++) {
        var dot = document.createElement('span');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
      }

      carousel.parentElement.appendChild(dotsContainer);

      carousel.addEventListener('scroll', function () {
        var scrollLeft = carousel.scrollLeft;
        var itemWidth = items[0].offsetWidth;
        var gap = 16;
        var activeIndex = Math.round(scrollLeft / (itemWidth + gap));
        var dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach(function (d, idx) {
          d.classList.toggle('active', idx === activeIndex);
        });
      }, { passive: true });
    });
  }

  // ── Pull-to-Refresh Easter Egg ──
  function setupPullToRefresh() {
    if (!isMobile) return;

    var pullIndicator = document.createElement('div');
    pullIndicator.className = 'pull-refresh-indicator';
    pullIndicator.innerHTML = '<div class="pull-refresh-logo">IC</div><span class="pull-refresh-text">Hey! You found a secret!</span>';
    document.body.appendChild(pullIndicator);

    var startY = 0;
    var currentY = 0;
    var pulling = false;
    var triggered = false;

    document.addEventListener('touchstart', function (e) {
      if (window.scrollY <= 0 && e.touches.length === 1) {
        startY = e.touches[0].clientY;
        pulling = true;
        triggered = false;
      }
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (!pulling) return;
      currentY = e.touches[0].clientY;
      var distance = (currentY - startY) * 0.4; // dampening

      if (distance > 0 && window.scrollY <= 0) {
        pullIndicator.style.transform = 'translateX(-50%) translateY(' + Math.min(distance, 120) + 'px)';
        pullIndicator.style.opacity = Math.min(distance / 80, 1);

        var logo = pullIndicator.querySelector('.pull-refresh-logo');
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
    if (!isMobile) return;

    var orbs = document.querySelectorAll('.orb');
    var heroImage = document.querySelector('.hero-image-wrapper');

    function handleOrientation(e) {
      var gamma = e.gamma || 0; // left-right tilt (-90 to 90)
      var beta = e.beta || 0;   // front-back tilt (-180 to 180)

      // Normalize to -1 to 1 range with max 15px shift
      var x = Math.max(-1, Math.min(1, gamma / 30)) * 15;
      var y = Math.max(-1, Math.min(1, (beta - 45) / 30)) * 15;

      orbs.forEach(function (orb, i) {
        var factor = 1 + i * 0.5;
        orb.style.transform = 'translate(' + (x * factor) + 'px, ' + (y * factor) + 'px)';
      });

      if (heroImage) {
        heroImage.style.transform = 'perspective(800px) rotateY(' + (x * 0.3) + 'deg) rotateX(' + (-y * 0.3) + 'deg)';
      }
    }

    // iOS 13+ requires permission
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Add a one-time gesture to request permission
      var requested = false;
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

    var shakeThreshold = 15;
    var shakeTimeout = 1000;
    var shakes = [];
    var lastShakeTime = 0;

    window.addEventListener('devicemotion', function (e) {
      var acc = e.accelerationIncludingGravity;
      if (!acc) return;

      var force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

      if (force > shakeThreshold + 9.8) {
        var now = Date.now();
        if (now - lastShakeTime > 250) {
          lastShakeTime = now;
          shakes.push(now);

          // Keep only recent shakes
          shakes = shakes.filter(function (t) { return now - t < shakeTimeout; });

          if (shakes.length >= 3) {
            shakes = [];
            haptic('heavy');

            var contact = document.getElementById('contact');
            if (contact) {
              contact.scrollIntoView({ behavior: 'smooth' });
              showToast("Shook up? Let's talk!");
            }
          }
        }
      }
    }, { passive: true });
  }

  // ── Long Press on Hero Photo ──
  function setupLongPress() {
    if (!isMobile) return;

    var heroImage = document.querySelector('.hero-image-wrapper');
    if (!heroImage) return;

    var pressTimer = null;

    heroImage.addEventListener('touchstart', function () {
      pressTimer = setTimeout(function () {
        haptic('medium');
        heroImage.classList.add('spin-reveal');
        showToast('Built with nothing but vanilla JS');

        setTimeout(function () {
          heroImage.classList.remove('spin-reveal');
        }, 1000);
      }, 500);
    }, { passive: true });

    heroImage.addEventListener('touchend', function () {
      clearTimeout(pressTimer);
    }, { passive: true });

    heroImage.addEventListener('touchmove', function () {
      clearTimeout(pressTimer);
    }, { passive: true });
  }

  // ── Konami Code (Swipe Pattern) ──
  function setupKonamiCode() {
    if (!isMobile) return;

    var pattern = ['up', 'up', 'down', 'down', 'left', 'right'];
    var current = [];
    var startX, startY;

    document.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      var minSwipe = 50;

      var direction = null;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > minSwipe) direction = dx > 0 ? 'right' : 'left';
      } else {
        if (Math.abs(dy) > minSwipe) direction = dy > 0 ? 'down' : 'up';
      }

      if (direction) {
        current.push(direction);
        if (current.length > pattern.length) current.shift();

        if (current.length === pattern.length && current.every(function (d, i) { return d === pattern[i]; })) {
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

    setTimeout(function () {
      document.body.classList.remove('party-mode');
    }, 5000);
  }

  // ── Lightbox Touch Gestures ──
  function setupLightboxGestures() {
    if (!isMobile) return;

    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var touchStartX = 0;
    var touchStartY = 0;
    var initialDistance = 0;
    var currentScale = 1;
    var img = lightbox.querySelector('.lightbox-img');

    lightbox.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      if (e.changedTouches.length === 1 && currentScale <= 1) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;

        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) {
          // Horizontal swipe — navigate
          var prevBtn = lightbox.querySelector('.lightbox-prev');
          var nextBtn = lightbox.querySelector('.lightbox-next');
          if (dx > 0 && prevBtn) prevBtn.click();
          else if (dx < 0 && nextBtn) nextBtn.click();
          haptic('light');
        } else if (Math.abs(dy) > 100 && Math.abs(dy) > Math.abs(dx) * 2) {
          // Vertical swipe down — close
          var closeBtn = lightbox.querySelector('.lightbox-close');
          if (closeBtn) closeBtn.click();
        }
      }

      // Reset scale
      if (e.touches.length === 0) {
        currentScale = 1;
        if (img) img.style.transform = '';
      }
    }, { passive: true });

    lightbox.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2 && img) {
        var distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        currentScale = Math.max(1, Math.min(3, distance / initialDistance));
        img.style.transform = 'scale(' + currentScale + ')';
      }
    }, { passive: true });

    // Double tap to zoom
    var lastTap = 0;
    lightbox.addEventListener('touchend', function (e) {
      var now = Date.now();
      if (now - lastTap < 300 && e.changedTouches.length === 1) {
        currentScale = currentScale > 1 ? 1 : 2;
        if (img) {
          img.style.transition = 'transform 0.3s ease';
          img.style.transform = currentScale > 1 ? 'scale(2)' : '';
          setTimeout(function () { img.style.transition = ''; }, 300);
        }
        haptic('light');
      }
      lastTap = now;
    }, { passive: true });
  }

  // ── Progressive Disclosure — Timeline Collapse ──
  function setupTimelineCollapse() {
    if (window.innerWidth > 768) return;

    document.querySelectorAll('.timeline-card').forEach(function (card) {
      var desc = card.querySelector('.timeline-desc');
      var tags = card.querySelector('.timeline-tags');
      if (!desc) return;

      card.classList.add('collapsed');

      card.addEventListener('click', function () {
        var wasCollapsed = card.classList.contains('collapsed');

        // Collapse all others
        document.querySelectorAll('.timeline-card.expanded').forEach(function (c) {
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

  // ── Tab Bar Active Bounce ──
  function setupTabBarBounce() {
    var tabBar = document.getElementById('mobile-tab-bar');
    if (!tabBar) return;

    tabBar.querySelectorAll('.tab-item').forEach(function (tab) {
      tab.addEventListener('touchstart', function () {
        var icon = tab.querySelector('.tab-icon');
        if (icon) {
          icon.style.transform = 'scale(0.85)';
          icon.style.transition = 'transform 0.1s ease';
        }
      }, { passive: true });

      tab.addEventListener('touchend', function () {
        var icon = tab.querySelector('.tab-icon');
        if (icon) {
          icon.style.transform = 'scale(1.15)';
          icon.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
          setTimeout(function () {
            icon.style.transform = '';
            icon.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
          }, 200);
        }
        haptic('light');
      }, { passive: true });
    });
  }

  // ── Navbar Auto-Hide on Mobile ──
  function setupNavbarAutoHide() {
    if (window.innerWidth > 768) return;

    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    var lastScrollY = window.scrollY;
    var navHidden = false;

    window.addEventListener('scroll', function () {
      var currentY = window.scrollY;
      var delta = currentY - lastScrollY;

      if (delta > 10 && currentY > 100 && !navHidden) {
        navbar.classList.add('nav-hidden');
        navHidden = true;
      } else if (delta < -5 && navHidden) {
        navbar.classList.remove('nav-hidden');
        navHidden = false;
      }

      lastScrollY = currentY;
    }, { passive: true });
  }

  // ── Init ──
  function init() {
    setupCarouselDots();
    setupPullToRefresh();
    setupGyroscope();
    setupShakeDetection();
    setupLongPress();
    setupKonamiCode();
    setupLightboxGestures();
    setupTimelineCollapse();
    setupTabBarBounce();
    setupNavbarAutoHide();

    // Re-setup on resize
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        setupCarouselDots();
      }, 300);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
