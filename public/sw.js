/* Service worker do Vida Financeira.
 * - Páginas (HTML): rede primeiro -> sempre carrega a versão mais nova quando há internet.
 * - Arquivos com hash (/assets/): cache primeiro (nunca mudam).
 * - Sem internet: usa a última versão salva, então o app abre offline.
 */
var CACHE = 'vida-financeira-v1';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function saveCopy(request, response) {
  if (response && response.status === 200 && response.type === 'basic') {
    var copy = response.clone();
    caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
  }
  return response;
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.indexOf('/assets/') !== -1) {
    event.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) { return saveCopy(req, res); });
      })
    );
    return;
  }

  event.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then(function (res) { return saveCopy(req, res); })
      .catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || (req.mode === 'navigate' ? caches.match('./') || caches.match('./index.html') : undefined);
        });
      })
  );
});
