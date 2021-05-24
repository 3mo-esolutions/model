class PwaHelper {
	private pwaPrompt?: Event

	constructor() {
		window.addEventListener('beforeinstallprompt', e => {
			e.preventDefault()
			this.pwaPrompt = e
		})
	}

	get isInstalled() {
		return window.matchMedia('(display-mode: standalone)').matches
	}

	async registerServiceWorker() {
		if (!navigator.serviceWorker.controller) {
			return
		}

		if (MoDeL.environment === 'test') {
			return
		}

		if (MoDeL.environment === 'development') {
			const serviceWorkers = await navigator.serviceWorker.getRegistrations()
			serviceWorkers.forEach(serviceWorker => serviceWorker.unregister())
			return
		}

		await navigator.serviceWorker.register('/ServiceWorker.js', { scope: '/' })
		await this.requestInstallation()
	}

	private async requestInstallation() {
		const isRequestPossible = this.pwaPrompt !== undefined

		if (isRequestPossible === false) {
			return
		}

		// @ts-ignore TypeScript library doesn't know about this specific event
		const choiceResult = await this.pwaPrompt?.prompt()
		if (choiceResult.outcome !== 'accepted') {
			throw new Error('PWA installation was not accepted')
		}
	}
}

export default new PwaHelper