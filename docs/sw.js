// My Spellbook — offline shell for the published build.
// Written by build.py; CACHE carries the build's own stamp, so a deploy retires every
// older cache the first time the new worker activates.
const CACHE = "spellbook-c73fd6782129";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./apple-touch-icon.png",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // addAll is all-or-nothing: one 404 would sink the whole install and the app would
    // never gain an offline copy at all. Cache what is actually there instead.
    await Promise.allSettled(SHELL.map(u => cache.add(u)));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Stale-while-revalidate. The page comes from the cache instantly and works with no
// network at all; the copy fetched behind it lands in the cache for the NEXT load, so
// an update is always exactly one reload behind — the trade taken deliberately, since
// the alternative is a 1 MB blocking download every time the app opens. GitHub Pages
// sends ETags, so that background fetch is a 304 whenever nothing has changed.
// The imported 5etools digest is NOT here: it lives in IndexedDB (D93) and never
// touches the network.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== location.origin) return;   // not ours to cache
  e.respondWith((async () => {
    try {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req, {ignoreSearch: true});
      const net = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      return hit || await net || new Response("Offline", {status: 503, statusText: "Offline"});
    } catch (_) {
      return fetch(req);   // the cache layer is never the reason a page fails to load
    }
  })());
});
