const CACHE_NAME = 'cookieclicker-v1';
const CORE_ASSETS = [
  '/',
  '/css/style.css',
  '/js/game.js',
  '/images/icon.png',
  '/images/cookie.png',
  '/images/bgBlue.jpg',
  '/images/panelBG.png',
  '/images/shine.png',
  '/images/panelVertical.png',
  '/images/panelHorizontal.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for same-origin navigations and static assets
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return resp;
      }).catch(() => caches.match('/')))
    );
  }
});
