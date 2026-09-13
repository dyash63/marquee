// Marquee service worker
// Caches only this app's own static shell (HTML/manifest/icons). Everything else —
// TMDB/watch-provider APIs, Firebase Auth/Firestore, Google Fonts — is left alone
// and goes straight to the network, so search/auth/data always stay live and fresh.

const CACHE_NAME = 'marquee-static-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin GET requests for our own static shell.
  // Everything else (TMDB API, watch-provider data, Firebase Auth/Firestore,
  // Google Fonts, any cross-origin call) is left completely untouched so the
  // app's live data is never served stale or intercepted.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isStaticShell = PRECACHE_URLS.some((p) => {
    const resolved = new URL(p, self.location.href).pathname;
    return url.pathname === resolved || url.pathname.endsWith('/index.html');
  });

  if (!isStaticShell) return;

  // Cache-first for the static shell, with a network refresh in the background
  // so updates to index.html/manifest/icons still reach users promptly.
  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
