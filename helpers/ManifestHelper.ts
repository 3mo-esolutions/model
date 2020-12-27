import { Manifest } from '../types'

export default class ManifestHelper {
	static cache: Manifest | undefined = undefined
	static async fetch(): Promise<Manifest> {
		if (this.cache)
			return this.cache

		try {
			const content = await fetch('/manifest.json')
			const jsonText = await content.text()
			this.cache = JSON.parse(jsonText)
			return this.cache as Manifest
		} catch {
			return {} as Manifest
		}
	}
}