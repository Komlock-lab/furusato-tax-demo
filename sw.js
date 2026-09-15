// Scope the cache to this GitHub Pages project, not other projects on the host.
const CACHE_PREFIX = `furusato-demo:${self.registration.scope}:`;
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const ASSETS = [
  './', './index.html', './styles.css', './mobile.css', './app.js', './pwa.js',
  './manifest.webmanifest', './assets/LINE_APP_iOS.png',
  './assets/design-reference.png', './assets/shine-muscat.jpg',
  './assets/icon-192.png', './assets/icon-512.png'
];
const urls = new Set(ASSETS.map((path) => new URL(path, self.registration.scope).href));
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
    .map((key) => caches.delete(key)))));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.search = '';
  if (!urls.has(url.href)) return;
  // Prefer current files online; fall back to the installed demo offline.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        await cache.put(url.href, response.clone());
        return response;
      }
      return (await cache.match(url.href)) || response;
    } catch {
      return (await cache.match(url.href)) || Response.error();
    }
  })());
});
