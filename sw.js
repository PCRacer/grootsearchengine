const STATIC_CACHE = "SSuiteGroot8";
const OFFLINE_FALLBACK = "/index.html";

const PRECACHE = [
  "/",
  "/index.html",
  "/news.htm",
  "/localweather.htm",
  "/favicon.ico",
  "/pwa/SSuiteGroot144.png",
  "/pwa/webappmanifest.webmanifest",
  "/static/css/font-awesome.min.css",
  "/static/css/fontawesome-webfont.woff2",
  "/static/fonts/ubuntu/ubuntu-v14-latin-ext_cyrillic_greek_greek-ext_cyrillic-ext_latin-700.woff2",
  "/static/fonts/roboto/roboto-v20-latin-ext_cyrillic_greek_greek-ext_cyrillic-ext_latin_vietnamese-700.woff2",
  "/static/fonts/roboto/roboto-v20-latin-ext_cyrillic_greek_greek-ext_cyrillic-ext_latin_vietnamese-regular.woff2",
  "/LightMode.jpg",
  "/DarkMode.jpg",
  "/newspaperdesk.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await Promise.all(
        PRECACHE.map(url =>
          cache.add(url).catch(err => {
            console.warn("Precache failed:", url, err);
          })
        )
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    (async () => {
      try {
        // 1️⃣ Check STATIC cache (SSuiteGroot8)
        const cached = await caches.match(event.request);
        if (cached) return cached;
        // 2️⃣ Network fetch
        const response = await fetch(event.request);
        // 3️⃣ Store only valid responses in STATIC cache
        if (response && response.status === 200 && response.type === "basic") {
          const cache = await caches.open(STATIC_CACHE);
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (err) {
        // 4️⃣ Offline fallback
        return await caches.match(OFFLINE_FALLBACK);
      }
    })()
  );
});
