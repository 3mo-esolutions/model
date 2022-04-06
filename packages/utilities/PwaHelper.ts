interface BeforeInstallPromptEvent extends Event {
	readonly platforms: Array<string>
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed'
		platform: string
	}>
	prompt(): Promise<void>
}

window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault()
	PwaHelper.pwaPrompt = e as BeforeInstallPromptEvent
})

export class PwaHelper {
	static pwaPrompt?: BeforeInstallPromptEvent

	static get isInstalled() {
		return window.matchMedia('(display-mode: standalone)').matches
	}

	static async registerServiceWorker() {
		if (MoDeL.environment === 'test') {
			return
		}

		const serviceWorkerContainer = navigator.serviceWorker as ServiceWorkerContainer | undefined

		if (!serviceWorkerContainer?.controller) {
			return
		}

		if (MoDeL.environment === 'development') {
			const serviceWorkers = await serviceWorkerContainer.getRegistrations()
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

		await this.pwaPrompt?.prompt()
		const userChoice = await this.pwaPrompt?.userChoice
		if (userChoice?.outcome !== 'accepted') {
			throw new Error('PWA installation was not accepted')
		}
	}
}