////#region FIX: REFACTORED does not work
// TODO [MD-103] research and improve service worker + make an offlineFallbackPage
// const CACHE = 'pwabuilder-offline'
// const offlineFallbackPage = 'index.html'

// self.addEventListener('install', async event => {
// 	const cache = await caches.open(CACHE)
// 	event.waitUntil(() => cache.add(offlineFallbackPage))
// })

// self.addEventListener('fetch', async event => {
// 	if (event.request.method !== 'GET')
// 		return

// 	const response = async () => {
// 		try {
// 			const response = await fetch(event.request)
// 			// If request was success, add or update it in the cache
// 			event.waitUntil(updateCache(event.request, response.clone()))
// 			return response
// 		} catch (error) {
// 			fromCache(event.request)
// 		}
// 	}

// 	event.respondWith(response)
// })

// async function fromCache(request) {
// 	const cache = await caches.open(CACHE)
// 	const matching = await cache.match(request)
// 	return (!matching || matching.status === 404)
// 		? Promise.reject('no-match')
// 		: matching
// }

// async function updateCache(request, response) {
// 	const cache = await caches.open(CACHE)
// 	cache.put(request, response)
// }

//// #endregion

const CACHE = 'pwabuilder-offline'
const offlineFallbackPage = 'index.html'

// Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener('install', (event) => {
	//console.log("[PWA Builder] Install Event processing")

	event.waitUntil(
		caches.open(CACHE).then((cache) => {
			//console.log("[PWA Builder] Cached offline page during install")

			if (offlineFallbackPage === 'index.html') {
				return cache.add(new Response('TODO: Update the value of the offlineFallbackPage constant in the serviceworker.'))
			}

			return cache.add(offlineFallbackPage)
		})
	)
})

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return

	event.respondWith(
		fetch(event.request)
			.then((response) => {
				//console.log("[PWA Builder] add page to offline cache: " + response.url)

				// If request was success, add or update it in the cache
				event.waitUntil(updateCache(event.request, response.clone()))

				return response
			})
			.catch(() => {
				//console.log("[PWA Builder] Network request Failed. Serving content from cache: " + error)
				return fromCache(event.request)
			})
	)
})

function fromCache(request) {
	// Check to see if you have it in the cache
	// Return response
	// If not in the cache, then return error page
	return caches.open(CACHE).then((cache) => {
		return cache.match(request).then((matching) => {
			if (!matching || matching.status === 404) {
				return Promise.reject('no-match')
			}

			return matching
		})
	})
}

function updateCache(request, response) {
	return caches.open(CACHE).then((cache) => {
		return cache.put(request, response)
	})
}