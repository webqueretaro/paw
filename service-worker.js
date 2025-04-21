const CACHE_NAME = 'pwa-queretaro-v19';
const urlsToCache = [
  '/paw/',
  '/paw/index.html',
  '/paw/home.html',
  '/paw/offers.html',
  '/paw/ofertas1.png',
  '/paw/ofertas2.png',
  '/paw/ofertas3.png',
  '/paw/ofertas4.png',
  '/paw/ofertas5.png',
  '/paw/ofertas6.png',
  '/paw/ofertas7.png',
  '/paw/ofertas8.png',
  '/paw/ofertas9.png',
  '/paw/manifest.json',
  '/paw/icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
