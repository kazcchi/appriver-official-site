// Service Worker - シンプルなキャッシュ管理
const CACHE_NAME = 'appriver-v1';
const urlsToCache = [
  '/',
  '/style.css',
  '/scroll-guide.js',
  '/pwa-controls.js',
  '/gesture-white.png',
  '/manifest.json'
];

// インストール時
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// リクエスト時
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // キャッシュにあれば返す、なければネットワークから取得
        return response || fetch(event.request);
      }
    )
  );
});

// アクティベート時（古いキャッシュを削除）
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});