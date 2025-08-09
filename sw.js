const CACHE = 'matrix-hns-v3';
const ASSETS = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // App shell: cache-first
  if (ASSETS.includes(url.pathname) || url.pathname === '' || url.pathname.endsWith('/')) {
    e.respondWith(
      caches.match(url.pathname === '' ? '/' : url.pathname).then(r => r || fetch(e.request))
    );
    return;
  }
});
