import { ApplicationProvider, applicationProvider } from '../library'
import { Manifest } from '../types'

@applicationProvider
export default class ManifestProvider extends ApplicationProvider {
	async provide() {
		try {
			const content = await fetch('/manifest.json')
			const jsonText = await content.text()
			window.Manifest = JSON.parse(jsonText)
		} catch {
			window.Manifest = {} as Manifest
		}
	}
}

declare global {
	let Manifest: Manifest
	interface Window {
		Manifest: Manifest
	}
}