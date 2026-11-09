/* Cache solo dello scheletro pubblico, MAI dei dati Google, token o documenti. */
const CACHE="aek-static-v1";
const ASSETS=["./","./index.html","./styles.css","./src/core.js","./src/google.js","./src/app.js","./manifest.webmanifest","./icons/aek-icon.svg"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return; // Esclude Google APIs, autenticazione, email e file
  if(!ASSETS.some(x=>new URL(x,self.registration.scope).pathname===url.pathname))return;
  event.respondWith(fetch(req).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
    return response;
  }).catch(()=>caches.match(req)));
});