const CACHE_NAME = "pwa-diario-v1";
const CORE_ASSETS = [
"/DiariodeobrasRiodejaneiro/",
"/DiariodeobrasRiodejaneiro/index.html",
// Adicione abaixo os seus arquivos principais se tiver: CSS/JS
// "/DiariodeobrasRiodejaneiro/styles.css",
// "/DiariodeobrasRiodejaneiro/script.js",
"/DiariodeobrasRiodejaneiro/icons/icon-192.png",
"/DiariodeobrasRiodejaneiro/icons/icon-512.png"
];


self.addEventListener("install", (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
);
});


self.addEventListener("activate", (event) => {
event.waitUntil(
caches.keys().then((keys) =>
Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
)
);
});


self.addEventListener("fetch", (event) => {
const req = event.request;
const accept = req.headers.get("accept") || "";


// HTML: network first, fallback cache
if (accept.includes("text/html")) {
event.respondWith(
fetch(req)
.then((res) => {
const copy = res.clone();
caches.open(CACHE_NAME).then((c) => c.put(req, copy));
return res;
})
.catch(() => caches.match(req).then((r) => r || caches.match("/DiariodeobrasRiodejaneiro/index.html")))
);
return;
}


// Demais assets: cache first, depois rede
event.respondWith(
caches.match(req).then((hit) =>
hit || fetch(req).then((res) => {
const copy = res.clone();
caches.open(CACHE_NAME).then((c) => c.put(req, copy));
return res;
})
)
);
});
