const CACHE_NAME = 'pwa-queretaro-v7';
const urlsToCache = [
  '/paw/',
  '/paw/index.html',
  '/paw/offers.html',
  '/paw/styles.css',
  '/paw/icons/icon-512.png',
  '/paw/ofertas.pdf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Forzar activación inmediata
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim()) // Tomar control de clientes inmediatamente
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(response => {
        // Servir desde caché si existe, o buscar en red
        return response || fetch(event.request).then(networkResponse => {
          // Cachear nuevas respuestas
          if (event.request.method === 'GET') {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
      })
  );
});
