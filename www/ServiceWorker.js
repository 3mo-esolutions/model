// TODO [MD-103] research and improve service worker + make an offlineFallbackPage
const CACHE = 'pwabuilder-offline'
const offlineFallbackPage = 'index.html'

self.addEventListener('install', async event => {
	const cache = await caches.open(CACHE)
	event.waitUntil(() => cache.add(offlineFallbackPage))
})

self.addEventListener('fetch', async event => {
	if (event.request.method !== 'GET')
		return

	const response = async () => {
		try {
			const response = await fetch(event.request)
			// If request was success, add or update it in the cache
			event.waitUntil(updateCache(event.request, response.clone()))
			return response
		} catch (error) {
			fromCache(event.request)
		}
	}

	event.respondWith(response)
})

async function fromCache(request) {
	const cache = await caches.open(CACHE)
	const matching = await cache.match(request)
	return (!matching || matching.status === 404)
		? Promise.reject('no-match')
		: matching
}

async function updateCache(request, response) {
	const cache = await caches.open(CACHE)
	cache.put(request, response)
}