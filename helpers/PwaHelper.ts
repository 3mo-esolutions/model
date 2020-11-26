class PwaHelper {
	readonly appInstalled = new PureEvent()

	private pwaPrompt?: Event

	get isInstalled() {
		return window.matchMedia('(display-mode: standalone)').matches
	}

	get isRequestPossible() {
		return this.pwaPrompt !== undefined
	}

	enablePWA() {
		window.addEventListener('beforeinstallprompt', e => {
			e.preventDefault()
			this.pwaPrompt = e
		})

		window.addEventListener('appinstalled', () => this.appInstalled.trigger())
	}

	async requestInstallation() {
		// @ts-ignore TypeScript library doesn't know about this specific event
		const choiceResult = await this.pwaPrompt?.prompt()
		if (choiceResult.outcome !== 'accepted') {
			throw new Error('PWA installation was not accepted')
		}
	}
}

export default new PwaHelper