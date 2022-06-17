const filesToCache = [
  '/',
  'index.html',
  'scanner.html',
  'history.html',
  'footer.html',
  'notification.html',
  'order.html',
  'profile.html',
  'qrcode.html',
  'img/logo.png',
  'img/logo-haris.svg',
  'img/no-data.svg',
  'img/profile-blank.svg',
  'img/scan.svg',
  'css/main.css',
  'js/main.js',
  'js/scan.js',
  'js/sw-declaration.js',
  'js/qrcode.min.js',
  'js/history.js'
];

const staticCacheName = 'gpsfoodvoucher-v0.9.1';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
  // self.skipWaiting();
});

//cached dulu baru check network

// self.addEventListener('fetch', (event) => {
//     event.respondWith(caches.open(staticCacheName).then((cache) => {
//       return cache.match(event.request).then((cachedResponse) => {
//         const fetchedResponse = fetch(event.request).then((networkResponse) => {
//           cache.put(event.request.url, networkResponse.clone());

//           return networkResponse;
//         });

//         return cachedResponse || fetchedResponse;
//       });
//     }));
// });

//check network dulu baru check cached

self.addEventListener('fetch', (event) => {
  // Check if this is a navigation request
  if (event.request.mode === 'navigate') {
    // Open the cache
    event.respondWith(caches.open(staticCacheName).then((cache) => {
      // Go to the network first
      return fetch(event.request.url).then((fetchedResponse) => {
        cache.put(event.request, fetchedResponse.clone());

        return fetchedResponse;
      }).catch(() => {
        // If the network is unavailable, get
        return cache.match(event.request.url);
      });
    }));
  } else {
    return;
  }
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheAllowlist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});