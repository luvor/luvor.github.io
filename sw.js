/**
 * Service Worker — Offline-first caching for PWA
 */
const CACHE_NAME = 'ic-portfolio-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/animations.js',
  '/js/particles.js',
  '/js/gestures.js',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/assets/portfolio/imagine-99.jpg',
  '/assets/portfolio/imagine-79.jpg',
  '/assets/portfolio/IMG_0167.jpg',
  '/assets/portfolio/IMG_1527.JPG',
  '/assets/portfolio/IMG_1825.JPG',
  '/assets/portfolio/IMG_1919.JPG',
  '/assets/portfolio/BB044F8D-5F02-40B8-AE15-B2B454256790.JPG',
];

// Install — precache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Navigation — network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Google Fonts — stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const fetched = fetch(request).then((response) => {
            cache.put(request, response.clone());
            return response;
          });
          return cached || fetched;
        })
      )
    );
    return;
  }

  // Static assets — cache first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
