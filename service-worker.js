/* Pioneer Home Health Services — service worker (offline support) */
var CACHE = "pioneer-v6";
var ASSETS = [
  "./", "./index.html", "./about.html", "./services.html", "./eligibility.html",
  "./faq.html", "./careers.html", "./contact.html", "./referral.html", "./404.html",
  "./assets/css/styles.css", "./assets/js/main.js", "./assets/js/config.js",
  "./assets/img/logo.svg", "./assets/img/hero-care.svg",
  "./assets/img/icon-192.png", "./assets/img/icon-512.png",
  "./compliance/privacy.html", "./compliance/patient-rights.html",
  "./compliance/nondiscrimination.html", "./compliance/accessibility.html"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.allSettled(ASSETS.map(function (u) { return c.add(u); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;                       // never touch form POSTs
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;             // let Supabase/fonts/maps hit network
  // Network-first for everything same-origin: always fresh when online,
  // fall back to cache (then home page) when offline.
  e.respondWith(
    fetch(req).then(function (resp) {
      if (resp && resp.ok) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return resp;
    }).catch(function () {
      return caches.match(req).then(function (r) {
        return r || (req.mode === "navigate" ? caches.match("./index.html") : Response.error());
      });
    })
  );
});
