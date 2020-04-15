let CACHE_NAME = 'v-0.0.2'
const urls_to_cache = [
    '/',
    '/register',
    '/static/js/axios.min.js',
    '/static/js/index.js'
]

self.addEventListener('install', event => {
    // Instala o serviceworker e adiciona os arquivos ao cache
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Abriu o cahce: ' + CACHE_NAME)
                return cache.addAll(urls_to_cache)
            })
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response)
                    return response
                return fetch(event.request)
            })
    )
})

this.addEventListener('activate', function (event) {
    var cacheWhitelist = [CACHE_NAME]

    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key)
                }
            }))
        })
    )
})