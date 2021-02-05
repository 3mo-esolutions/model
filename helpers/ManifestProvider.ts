import { ApplicationProvider, applicationProvider } from '../library'
import { Manifest } from '../types'

@applicationProvider()
export default class ManifestProvider extends ApplicationProvider {
	async provide() {
		const manifestLink = window.document.head.querySelector<HTMLLinkElement>('link[rel=manifest]')

		if (!manifestLink) {
			window.Manifest = {} as Manifest
			return
		}

		const content = await fetch(manifestLink.href)
		const jsonText = await content.text()
		window.Manifest = JSON.parse(jsonText)
	}
}

declare global {
	let Manifest: Manifest
	interface Window {
		Manifest: Manifest
	}
}