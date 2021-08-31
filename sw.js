const staticCacheName = 'site-static-v1.15.79.3';
const dinamicCacheName = 'site-dinamic-v1.15.79.3';

const assetsUrls = [
  '/',
  'catalog/view/theme/solodance/js/script.js',
  'catalog/view/theme/solodance/css/core.css',
  'catalog/view/theme/solodance/css/style.css',
  'offline.html'
];

// install event
self.addEventListener('install', event => {
  //self.skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => cache.addAll(assetsUrls))
  );
});

// activate event
self.addEventListener('activate', async evt => {
  const cacheNames = await caches.keys();  
  await Promise.all (
    cacheNames
        .filter(name => name !== staticCacheName)
        .filter(name => name !== dinamicCacheName)
        .map(name => caches.delete(name))
  );  
});

// When we change the name we could have multiple cache, to avoid that we need to delet the old cache, so with this function we check the key that is our cache naming, if it is different from the actual naming we delete it, in this way we will always have only the last updated cache.
// fetch event
self.addEventListener('fetch', event => {
  // console.log('Fetch', event.request.url);
  const {request} = event;

  const url = new URL(request.url);
  if(url.origin === location.origin){
    event.respondWith(cacheFirst(request));
  } else{
    event.respondWith(networkFirst(request));
  }
  
});

async function cacheFirst(request){
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}

async function networkFirst(request){
  const cache = await caches.open(dinamicCacheName);
  try{
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (e){
    const cached = await cache.match(request);
    return cached ?? await caches.match('offline.html');
  }
  
}

// self.addEventListener('install', function(event) {
//   var indexPage = new Request('index.html');
//   event.waitUntil(
//     fetch(indexPage).then(function(response) {
//       return caches.open('pwabuilder-offline').then(function(cache) {
//         console.log('[PWA Builder] Cached index page during Install'+ response.url);
//         return cache.put(indexPage, response);
//       });
//   }));
// });
// self.addEventListener('fetch', function(event) {
//   var updateCache = function(request){
//     return caches.open('pwabuilder-offline').then(function (cache) {
//       return fetch(request).then(function (response) {
//         console.log('[PWA Builder] add page to offline'+response.url)
//         return cache.put(request, response);
//       });
//     });
//   };
//   event.waitUntil(updateCache(event.request));
//   event.respondWith(
//     fetch(event.request).catch(function(error) {
//       console.log( '[PWA Builder] Network request Failed. Serving content from cache: ' + error );
//       return caches.open('pwabuilder-offline').then(function (cache) {
//         return cache.match(event.request).then(function (matching) {
//           var report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
//           return report
//         });
//       });
//     })
//   );
// })
