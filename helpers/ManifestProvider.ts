import { ApplicationProvider, applicationProvider } from '../library'
import { Manifest } from '../types'

@applicationProvider()
export default class ManifestProvider extends ApplicationProvider {
	async provide() {
		const manifestLink = globalThis.document.head.querySelector<HTMLLinkElement>('link[rel=manifest]')

		if (!manifestLink) {
			globalThis.Manifest = {} as Manifest
			return
		}

		const content = await fetch(manifestLink.href)
		const jsonText = await content.text()
		globalThis.Manifest = JSON.parse(jsonText)
	}
}

declare global {
	// eslint-disable-next-line no-var
	var Manifest: Manifest
}