const CACHE_NAME = "veiled-verse-v1";
const urlsToCache = ["/", "/index.html", "/vite.svg"];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      // Cache files individually to handle failures gracefully
      return Promise.allSettled(
        urlsToCache.map((url) =>
          cache.add(url).catch((error) => {
            console.warn(`Failed to cache ${url}:`, error);
            return null;
          }),
        ),
      );
    }),
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            })
            .catch((error) => {
              console.warn("Failed to cache response:", error);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync any pending offline actions
    const pendingActions = await getPendingActions();

    for (const action of pendingActions) {
      await syncAction(action);
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

async function getPendingActions() {
  // Get pending actions from IndexedDB
  return [];
}

async function syncAction(action) {
  // Sync individual action
  console.log("Syncing action:", action);
}
