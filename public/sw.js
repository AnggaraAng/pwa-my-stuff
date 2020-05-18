const staticCacheName = 'site-static-v6';
const dynamicCacheName = 'site-dynamic-v9';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/facilities.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/page/fallback.html',
];

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
};

//install event service worker
self.addEventListener('install', (evt =>{
    // console.log('Service Worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
    
}));

//activate Service Worker
self.addEventListener('activate', evt => {
    // console.log('Service Worker has been Activated') 
    evt.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys); 
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
}); 

//fetch event
self.addEventListener('fetch', evt => {
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
      evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
          return cacheRes || fetch(evt.request).then(fetchRes => {
            return caches.open(dynamicCacheName).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              // check cached items size
              limitCacheSize(dynamicCacheName, 15);
              return fetchRes;
            })
          });
        }).catch(() => {
          if(evt.request.url.indexOf('.html') > -1){
            return caches.match('/page/fallback.html');
          }
        })
      );
    }
});