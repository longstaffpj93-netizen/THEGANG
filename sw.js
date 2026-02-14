// ===================================
// SERVICE WORKER FOR THE GANG PWA
// Offline functionality and caching
// ===================================

const CACHE_NAME = 'the-gang-v1.0.0';
const OFFLINE_URL = '/index.html';

// Assets to cache immediately
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/auth.html',
    '/profile.html',
    '/feed.html',
    '/team.html',
    '/merch.html',
    '/car-meets.html',
    '/assets/css/main.css',
    '/assets/js/bundle.js',
    '/auth-check.js',
    '/profile-generator.js',
    '/asset-manager.js',
    '/assets/images/THE_GANG_logo.png',
    '/assets/images/background.jpg'
];

// Dynamic cache for runtime caching
const DYNAMIC_CACHE_NAME = 'the-gang-dynamic-v1.0.0';

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle different types of requests
    if (request.method !== 'GET') return;

    // Skip external requests (CDNs, APIs, etc.)
    if (!url.origin.includes('github.io') && url.origin !== location.origin) {
        return;
    }

    // Network-first strategy for HTML pages (always try fresh content)
    if (request.destination === 'document' ||
        request.headers.get('Accept').includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache successful responses
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE_NAME)
                            .then((cache) => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback to cache or offline page
                    return caches.match(request)
                        .then((cachedResponse) => {
                            return cachedResponse || caches.match(OFFLINE_URL);
                        });
                })
        );
        return;
    }

    // Cache-first strategy for static assets
    if (request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'image' ||
        request.destination === 'font') {
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Fetch and cache
                    return fetch(request)
                        .then((response) => {
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(DYNAMIC_CACHE_NAME)
                                    .then((cache) => cache.put(request, responseClone));
                            }
                            return response;
                        })
                        .catch(() => {
                            // Return a fallback for images
                            if (request.destination === 'image') {
                                return caches.match('/assets/images/THE_GANG_logo.png');
                            }
                        });
                })
        );
        return;
    }

    // Default: try network first, fallback to cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE_NAME)
                        .then((cache) => cache.put(request, responseClone));
                }
                return response;
            })
            .catch(() => {
                return caches.match(request);
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered');

    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sync any pending actions (feed posts, profile updates, etc.)
        const pendingActions = await getPendingActions();

        for (const action of pendingActions) {
            try {
                await syncAction(action);
                await removePendingAction(action.id);
            } catch (error) {
                console.error('Failed to sync action:', action.id, error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push received');

    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/images/THE_GANG_logo.png',
            badge: '/assets/images/THE_GANG_logo.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.url || '/'
            }
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');

    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

// Periodic background tasks (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'content-sync') {
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    try {
        // Update cache with fresh content
        const cache = await caches.open(DYNAMIC_CACHE_NAME);

        // Refresh important pages
        const pagesToRefresh = ['/feed.html', '/team.html', '/car-meets.html'];

        for (const page of pagesToRefresh) {
            try {
                const response = await fetch(page);
                if (response.status === 200) {
                    await cache.put(page, response);
                    console.log('Refreshed cached page:', page);
                }
            } catch (error) {
                console.warn('Failed to refresh page:', page, error);
            }
        }
    } catch (error) {
        console.error('Content sync failed:', error);
    }
}

// Utility functions for offline data management
async function getPendingActions() {
    // In a real app, this would get data from IndexedDB
    return [];
}

async function syncAction(action) {
    // In a real app, this would send data to server
    console.log('Syncing action:', action);
}

async function removePendingAction(actionId) {
    // In a real app, this would remove from IndexedDB
    console.log('Removed pending action:', actionId);
}

// Cache management utilities
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        calculateCacheSize().then((size) => {
            event.ports[0].postMessage({ cacheSize: size });
        });
    }
});

async function calculateCacheSize() {
    try {
        const cacheNames = await caches.keys();
        let totalSize = 0;

        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();

            for (const request of keys) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
        }

        return totalSize;
    } catch (error) {
        console.error('Failed to calculate cache size:', error);
        return 0;
    }
}

// Performance monitoring integration
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PERFORMANCE_DATA') {
        // Store performance data for analysis
        console.log('Performance data received:', event.data.payload);
    }
});
