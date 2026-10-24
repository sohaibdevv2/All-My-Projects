// Bump this version on every meaningful update to purge old caches
const CACHE_NAME = "cmr-resume-v3"

const urlsToCache = [
  "/",
  "/index.html",
  "/form.html",
  "/cover.html",
  "/style.css",
  "/script.js",
  "/ai.js",
  "/manifest.json",
  "/logo.png",
]

// Install — pre-cache core assets, activate immediately
self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache).catch(() => {}))
  )
})

// Activate — delete ALL old caches, take control of open pages now
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.map((n) => (n !== CACHE_NAME ? caches.delete(n) : null))))
      .then(() => self.clients.claim())
  )
})

// Fetch — NETWORK-FIRST: always try fresh, fall back to cache only when offline.
self.addEventListener("fetch", (event) => {
  const req = event.request
  if (req.method !== "GET") return
  if (!req.url.startsWith(self.location.origin)) return

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {})
        return res
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match("/index.html")))
  )
})
