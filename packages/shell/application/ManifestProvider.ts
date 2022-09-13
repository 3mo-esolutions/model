import { Manifest } from '..'
import { ApplicationProvider, applicationProvider } from '.'

@applicationProvider()
export class ManifestProvider extends ApplicationProvider {
	async provide() {
		const manifestLink = globalThis.document.head.querySelector<HTMLLinkElement>('link[rel=manifest]')

		if (!manifestLink) {
			globalThis.Manifest = undefined
			return
		}

		const content = await fetch(manifestLink.href)
		const jsonText = await content.text()
		globalThis.Manifest = JSON.parse(jsonText)
	}
}

declare global {
	// eslint-disable-next-line
	var Manifest: Manifest | undefined
}