// Marquee service worker
// Caches only this app's own static shell. Everything else — TMDB/watch-provider
// APIs, Firebase Auth/Firestore, Google Fonts — is left alone and goes straight
// to the network, so search/auth/data always stay live and fresh.
//
// index.html is served NETWORK-FIRST: the app's code changes fairly often during
// development, and a cache-first HTML shell can silently keep serving an old
// version of the app after you deploy a fix (exactly what happened here — the
// API key Firestore sync was added to index.html, but nothing told an
// already-installed service worker that the cached copy was stale). Only if the
// network is unreachable (offline) does it fall back to the last cached copy.
//
// icons/manifest.json rarely change, so those stay cache-first for speed.
//
// NOTE: bump CACHE_NAME (e.g. v2 -> v3) any time you want to force every
// already-installed copy of this service worker to drop its old cache —
// the browser only re-installs a service worker when sw.js's own bytes change.
const CACHE_NAME = 'marquee-static-v2';

const NETWORK_FIRST_URLS = ['./', './index.html'];
const CACHE_FIRST_URLS = [
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([...NETWORK_FIRST_URLS, ...CACHE_FIRST_URLS]))
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

function resolvedPath(p) {
  return new URL(p, self.location.href).pathname;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin GET requests for our own static shell.
  // Everything else (TMDB API, watch-provider data, Firebase Auth/Firestore,
  // Google Fonts, any cross-origin call) is left completely untouched so the
  // app's live data is never served stale or intercepted.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isNetworkFirst = NETWORK_FIRST_URLS.some((p) => url.pathname === resolvedPath(p))
    || url.pathname.endsWith('/index.html');
  const isCacheFirst = CACHE_FIRST_URLS.some((p) => url.pathname === resolvedPath(p));

  if (isNetworkFirst) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  if (isCacheFirst) {
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
  }
});
