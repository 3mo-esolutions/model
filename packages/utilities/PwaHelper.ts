window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault()
	PwaHelper.pwaPrompt = e
})

export class PwaHelper {
	static pwaPrompt?: Event

	static get isInstalled() {
		return window.matchMedia('(display-mode: standalone)').matches
	}

	static async registerServiceWorker() {
		const serviceWorkerContainer = navigator.serviceWorker as ServiceWorkerContainer | undefined

		if (!serviceWorkerContainer?.controller) {
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

		await serviceWorkerContainer.register('/ServiceWorker.js', { scope: '/' })
		await this.requestInstallation()
	}

	private static async requestInstallation() {
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