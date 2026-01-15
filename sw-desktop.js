// sw-desktop.js - Service Worker voor Honden Database Desktop Edition
const CACHE_NAME = 'honden-desktop-cache-v' + Date.now();
const CORE_ASSETS = [
  '/desktop/',
  '/desktop/index.html',
  '/desktop/app.html',
  '/desktop/css/style.css',
  '/desktop/js/auth.js',
  '/desktop/js/database.js',
  '/desktop/js/ui-handler.js',
  '/desktop/js/modules/BaseModule.js',
  '/desktop/manifest.json',
  '/desktop/img/logo.png'
];

// INSTALL - Cache basis
self.addEventListener('install', event => {
  console.log('SW Desktop: Installatie gestart');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW Desktop: Cachen core bestanden voor Desktop Edition');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('SW Desktop: Direct activeren');
        return self.skipWaiting();
      })
  );
});

// ACTIVATE - Oude desktop caches verwijderen
self.addEventListener('activate', event => {
  console.log('SW Desktop: Activeren gestart');
  event.waitUntil(
    Promise.all([
      // Verwijder alleen desktop caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.includes('honden-desktop-cache') && cacheName !== CACHE_NAME) {
              console.log('SW Desktop: Verwijder oude desktop cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Claim alle tabs direct
      self.clients.claim()
    ]).then(() => {
      console.log('SW Desktop: Klaar voor gebruik');
    })
  );
});

// FETCH - Simpel: netwerk eerst, anders cache
self.addEventListener('fetch', event => {
  const request = event.request;

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Service worker zelf overslaan
  if (request.url.includes('/sw-desktop.js')) {
    return fetch(request);
  }

  // Alleen requests binnen desktop scope afhandelen
  if (!request.url.includes('/desktop/')) {
    return;
  }

  event.respondWith(
    // Probeer eerst netwerk
    fetch(request)
      .then(response => {
        // Succes: update cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(request, responseClone);
          });
        return response;
      })
      .catch(() => {
        // Netwerk faalt: probeer cache
        return caches.match(request)
          .then(cached => {
            if (cached) {
              return cached;
            }
            // Voor HTML: val terug op index
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/desktop/index.html');
            }
            return new Response('Desktop Edition Offline', { status: 503 });
          });
      })
  );
});

// Forceer update bij bericht
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
