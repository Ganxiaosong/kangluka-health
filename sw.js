const CACHE_NAME = 'kangluka-v1';
const urlsToCache = [
  '/kangluka-health/',
  '/kangluka-health/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).catch(() => caches.match('/kangluka-health/index.html'));
      })
  );
});
