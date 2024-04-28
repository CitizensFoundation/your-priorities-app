// Service Worker Script

// Define the cache name
const CACHE_NAME = 'yrpri9-cachev1';

// Install event: Pre-cache essential assets and force the service worker to become active
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Pre-cache important resources that don't change often
        return cache.addAll([
          '/offline.html'
        ]);
      })
  );
  self.skipWaiting(); // Force this installing service worker to become the active service worker
});

// Fetch event: Implement different strategies based on the resource type
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.url.match(/\.[js]$/)) {
    // Cache First strategy for .js files
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
    );
  } else {
    // Network First strategy for other requests
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // If the network is unavailable, fall back to the cached version
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || caches.match('/offline.html');
        });
      })
    );
  }
});

// Activate event: Clean up old caches and take control of the pages
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      // Deleting all caches not in the whitelist
      return Promise.all(
        cacheNames.map(cacheName => {
          if (CACHE_NAME.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim()) // After cleaning up, take control of the pages
  );
});
