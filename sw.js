const CACHE_NAME = 'ic-portfolio-v6';
const RUNTIME_CACHE = 'ic-portfolio-runtime-v6';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/versions.html',
  '/css/style.css',
  '/css/versions.css',
  '/js/main.js',
  '/js/animations.js',
  '/js/particles.js',
  '/js/versions.js',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-maskable-512.png',
  '/assets/portfolio/CV_Chynybekov_2026.pdf',
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
