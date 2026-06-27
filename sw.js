const CACHE_NAME = 'kangluka-v2';
const urlsToCache = [
  '/kangluka-health/',
  '/kangluka-health/index.html',
  '/kangluka-health/manifest.json'
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

// 接收页面发来的提醒通知
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 192 192%22%3E%3Crect fill=%22%23667eea%22 width=%22192%22 height=%22192%22 rx=%2240%22/%3E%3Ctext x=%2296%22 y=%22125%22 font-size=%2290%22 text-anchor=%22middle%22 fill=%22white%22%3E%F0%9F%8F%A5%3C/text%3E%3C/svg%3E',
      badge: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 192 192%22%3E%3Crect fill=%22%23667eea%22 width=%22192%22 height=%22192%22 rx=%2240%22/%3E%3Ctext x=%2296%22 y=%22125%22 font-size=%2290%22 text-anchor=%22middle%22 fill=%22white%22%3E%F0%9F%8F%A5%3C/text%3E%3C/svg%3E',
      tag: event.data.tag || 'reminder',
      requireInteraction: true
    });
  }
});
