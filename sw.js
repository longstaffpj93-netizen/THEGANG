// ===================================
// SERVICE WORKER FOR THE GANG PWA
// Modernized for THE GANG V2
// ===================================

const CACHE_NAME = 'the-gang-v2.0.0';
const OFFLINE_URL = 'index.html';

const STATIC_CACHE_URLS = [
    './',
    'index.html',
    'auth.html',
    'profile.html',
    'feed.html',
    'team.html',
    'merch.html',
    'car-meets.html',
    'assets/js/core.js',
    'assets/js/layout.js',
    'assets/js/feed.js',
    'assets/js/profile.js',
    'assets/js/shop.js',
    'assets/js/meets.js',
    'assets/images/THE_GANG_logo.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_CACHE_URLS))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
            .then(response => response || caches.match(OFFLINE_URL))
    );
});
