(function () {
  'use strict';
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  function closeMenu() {
    if (!toggle || !links) return;
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('open');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  var deferredInstall = null;
  var installButton = document.querySelector('.install-button');
  var installLinks = document.querySelector('.contact-links');

  function removeInstallButton() {
    if (installButton) installButton.remove();
    installButton = null;
  }

  function promptInstall() {
    if (!deferredInstall) return;
    var prompt = deferredInstall;
    deferredInstall = null;
    installButton.disabled = true;
    prompt.prompt();
    prompt.userChoice.then(removeInstallButton);
  }

  function createInstallButton() {
    installButton = document.createElement('button');
    installButton.className = 'install-button';
    installButton.setAttribute('data-i18n', 'pwa.install');
    installButton.textContent = window.__i18n.t('pwa.install');
    installButton.addEventListener('click', promptInstall);
    installLinks.appendChild(installButton);
  }

  if (installButton) installButton.addEventListener('click', promptInstall);

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredInstall = event;
    if (!installButton) createInstallButton();
    installButton.hidden = false;
    installButton.disabled = false;
  });

  window.addEventListener('appinstalled', function () {
    deferredInstall = null;
    removeInstallButton();
  });

  // Motion previews only load while visible; the poster is always the fallback.
  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-motion]').forEach(function (tile) {
    var video = tile.querySelector('video');
    var button = tile.querySelector('.motion-toggle');
    if (!video || !button) return;
    var visible = false;
    var userPaused = true;
    var failed = false;
    var pending = false;
    var generation = 0;

    function shouldPlay() {
      return visible && !document.hidden && !motionPreference.matches && !userPaused && !failed;
    }

    function render() {
      var playing = shouldPlay() && !video.paused;
      tile.classList.toggle('is-playing', playing);
      var key = playing ? 'range.motion.pause' : 'range.motion.play';
      button.setAttribute('data-i18n', key);
      button.setAttribute('aria-label', window.__i18n ? window.__i18n.t(key) : (playing ? 'Pause preview' : 'Play preview'));
      button.setAttribute('aria-pressed', String(playing));
      button.disabled = motionPreference.matches;
    }

    function reconcile() {
      if (!shouldPlay()) {
        generation++;
        pending = false;
        video.pause();
        if (motionPreference.matches && video.hasAttribute('src')) {
          video.removeAttribute('src');
          video.load();
        }
        render();
        return;
      }
      if (!video.paused || pending) {
        render();
        return;
      }
      var attempt = ++generation;
      if (!video.hasAttribute('src')) video.src = video.dataset.src;
      pending = true;
      video.play().then(function () {
        if (attempt !== generation || !shouldPlay()) {
          if (!shouldPlay()) video.pause();
        } else pending = false;
        render();
      }).catch(function () {
        if (attempt !== generation) return;
        pending = false;
        failed = true;
        video.pause();
        render();
      });
    }

    button.addEventListener('click', function () {
      if (motionPreference.matches) return;
      userPaused = pending || !video.paused;
      failed = false;
      reconcile();
    });
    video.addEventListener('playing', function () {
      if (!shouldPlay()) video.pause();
      render();
    });
    video.addEventListener('pause', render);
    video.addEventListener('error', function () {
      failed = true;
      reconcile();
    });
    motionPreference.addEventListener('change', reconcile);
    document.addEventListener('visibilitychange', reconcile);
    document.addEventListener('languagechange', render);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        reconcile();
      }, { threshold: .25 }).observe(tile);
    } else {
      button.hidden = true;
    }
    render();
  });


})();
