const CACHE_NAME = 'ic-portfolio-v19';
const RUNTIME_CACHE = 'ic-portfolio-runtime-v19';
const LEGACY_CV_PATH = '/assets/portfolio/CV_Chynybekov_2026.pdf';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/versions.html',
  '/css/style.css',
  '/css/versions.css',
  '/js/main.js',
  '/js/i18n.js',
  '/assets/portfolio/cases/tripmaxx.webp',
  '/assets/portfolio/cases/netmatch-promo.webp',
  '/assets/portfolio/cases/naqyl.webp',
  '/assets/portfolio/cases/tact.webp',
  '/assets/portfolio/cases/yasnoten.webp',
  '/assets/portfolio/cases/ozger.webp',
  '/assets/portfolio/cases/motion.webp',
  '/assets/portfolio/cases/redteu.webp',
  '/assets/portfolio/cases/beni.webp',
  '/assets/portfolio/cases/ai.webp',
  '/assets/portfolio/portrait.webp',
  '/js/versions.js',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-maskable-512.png',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== CACHE_NAME && key !== RUNTIME_CACHE;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin === self.location.origin && url.pathname === LEGACY_CV_PATH) {
    event.respondWith(new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    }));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(function () {
          return caches.match(request).then(function (cachedPage) {
            return cachedPage || caches.match('/index.html');
          });
        })
    );
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(function (cache) {
        return cache.match(request).then(function (cachedResponse) {
          var fetchedResponse = fetch(request).then(function (response) {
            cache.put(request, response.clone());
            return response;
          });

          return cachedResponse || fetchedResponse;
        });
      })
    );
    return;
  }

  if (request.destination === 'video' || url.pathname.endsWith('.mp4')) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.destination === 'image' || (request.destination === 'document' && url.pathname.endsWith('.pdf'))) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(function (cache) {
        return cache.match(request).then(function (cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then(function (response) {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cachedResponse) {
      if (cachedResponse) {
        fetch(request).then(function (response) {
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, response);
          });
        });
        return cachedResponse;
      }
      return fetch(request);
    })
  );
});
