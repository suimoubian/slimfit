/* ====== Service Worker (Offline Cache) ====== */
const CACHE_NAME = 'slimfit-v2';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/themes.css',
  './css/animations.css',
  './css/style.css',
  './js/storage.js',
  './js/i18n.js',
  './js/confetti.js',
  './js/calendar.js',
  './js/checkin.js',
  './js/health.js',
  './js/diet.js',
  './js/plan.js',
  './js/settings.js',
  './js/summary.js',
  './js/app.js',
  './recipes.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
