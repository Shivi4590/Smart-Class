<<<<<<< HEAD
// public/js/service-worker.js
const CACHE_NAME = 'next-js-cache-v2';
//const OFFLINE_PAGE = '/offline';

// Files to cache (updated for Next.js/Turbopack)
const urlsToCache = [
  '/',
  //'/manifest.json',
  //'/_next/static/css/*',
  '/_next/static/chunks/*',
  '/_next/static/media/*',
  //'/_next/static/webpack/*',
  //OFFLINE_PAGE
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
          .catch((error) => {
            console.log('Failed to cache some assets:', error);
          });
      })
  );
  console.log('Service Worker installed');
=======
const CACHE_NAME = 'next-js-cache-v3'; // Change the version to force an update

const urlsToCache = [
  '/',
  '/_next/static/chunks/*',
  '/_next/static/media/*',
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(urlsToCache);
        console.log('Assets cached successfully');
      } catch (error) {
        console.error('Failed to cache some assets:', error);
      }
    })
  );

  self.skipWaiting(); // Ensures the new service worker activates immediately
>>>>>>> af0fcc9 (changes done)
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
<<<<<<< HEAD
  // Clean up old caches
=======

>>>>>>> af0fcc9 (changes done)
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
<<<<<<< HEAD
=======
            console.log(`Deleting old cache: ${cache}`);
>>>>>>> af0fcc9 (changes done)
            return caches.delete(cache);
          }
        })
      );
    })
  );
<<<<<<< HEAD
=======

  self.clients.claim(); // Takes control of all pages immediately
>>>>>>> af0fcc9 (changes done)
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
<<<<<<< HEAD
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) return cachedResponse;

        // For navigation requests, fall back to network
        // if (event.request.mode === 'navigate') {
        //   return fetch(event.request)
        //     .catch(() => caches.match(OFFLINE_PAGE));
        // }

        // For other requests, try network first
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache));
            }
            return response;
          })
          .catch(() => {
            // Return offline page for HTML requests
            // if (event.request.headers.get('accept').includes('text/html')) {
            //   return caches.match(OFFLINE_PAGE);
            // }
            console.error("Caching failed");
          });
      })
  );
});
=======
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return cached file if available
      }

      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          console.error('Network request failed');
        });
    })
  );
});
>>>>>>> af0fcc9 (changes done)
