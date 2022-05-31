const filesToCache = [
  '/',
  'index.html',
  'scanner.html',
  'history.html',
  'img/logo.png',
  'css/main.css',
  'js/main.js',
  'js/sw-declaration.js',
  'js/html5-qrcode.min.js'
];

const staticCacheName = 'gpsfoodvoucher-v0.9';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.open(staticCacheName).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          cache.put(event.request.url, networkResponse.clone());

          return networkResponse;
        });

        return cachedResponse || fetchedResponse;
      });
    }));
});

// self.addEventListener('fetch', event => {
//   console.log('Fetch event for ', event.request.url);
//   event.respondWith(
//     caches.match(event.request)
//     .then(response => {
//       if (response) {
//         console.log('Found ', event.request.url, ' in cache');
//         return response;
//       }
//       console.log('Network request for ', event.request.url);
//       return fetch(event.request).then(response => {
//         // TODO 5 - Respond with custom 404 page
//         return caches.open(staticCacheName).then(cache => {
//           cache.put(event.request.url, response.clone());
//           return response;
//         });
//       });

//     }).catch(error => {
//       return caches.match(event.request.url).then((cachedResponse)=>{
//         if (cachedResponse) {
//           return cachedResponse;
//         }
//       });
//       // TODO 6 - Respond with custom offline page

//     })
//   );
// });

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