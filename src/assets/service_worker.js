const appVersion = "#$#$#$";

const assets = [
    "/",
    "/index.html",
    "/assets/index.css",
    "/assets/index.js",
    "/assets/manifest.json",
    "/assets/material.woff",
    "/assets/material.woff2",
    "/assets/Framework7Icons.woff",
    "/assets/Framework7Icons.woff2",
    "/assets/logo.svg",
    "/assets/logo_receipt.svg",
    "/icons/favicon.png",
];

/**
 * limit cache contents size
 *
 * @param {*} name name of cache object
 * @param {*} size size to limit object contents
 */
const limitCacheSize = (name, size) => {
    caches.open(name).then((cache) => {
        cache.keys().then((keys) => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
};

self.addEventListener("install", (evt) => {
    self.skipWaiting();
    evt.waitUntil(
        caches.open(appVersion).then((cache) => {
            const _assets = assets.filter((asset) => asset !== "");
            cache.addAll(_assets);
        })
    );
});

self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        (async () => {
            // eslint-disable-next-line no-undef
            await clients.claim();

            const cacheKeys = await caches.keys();
            await Promise.all(
                cacheKeys
                    .filter((key) => key !== appVersion)
                    .map((key) => caches.delete(key))
            );
        })()
    );
});

self.addEventListener("fetch", (evt) => {
    // evt.respondWith(
    //     fetch(evt.request).then(async (fetchRes) => {
    //         return fetchRes;
    //     })
    // );
    if (
        evt.request.url.indexOf("apimanager") === -1 &&
        evt.request.url.indexOf("us-central1") === -1 &&
        evt.request.url.indexOf("service_worker") === -1
    ) {
        evt.respondWith(
            caches
                .match(evt.request)
                .then((cacheRes) => {
                    return (
                        cacheRes ||
                        fetch(evt.request).then(async (fetchRes) => {
                            const cache = await caches.open(appVersion);
                            cache.put(evt.request.url, fetchRes.clone());
                            limitCacheSize(appVersion, 150);
                            return fetchRes;
                        })
                    );
                })
                .catch(() => {
                    // if(evt.request.url.indexOf('.html') > -1){
                    //   return caches.match('/pages/fallback.html');
                    // }
                })
        );
    }
});
