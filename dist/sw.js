const CACHE='holmes-case1-v1.1';
const FILES=['./','./index.html','./style.css','./app.mjs','./engine.mjs','./story.mjs','./world.mjs','./manifest.webmanifest','./assets/theatre.webp','./assets/london.webp','./assets/holmes.webp','./assets/holmes-back.webp','./assets/watson.webp','./assets/watson-back.webp'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('holmes-case1-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;const u=new URL(e.request.url);if(!FILES.some(f=>new URL(f,self.registration.scope).pathname===u.pathname))return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));});
