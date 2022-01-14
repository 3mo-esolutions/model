/* eslint-disable */
import type { Application } from '..'

declare const environment: string

// eslint-disable-next-line @typescript-eslint/naming-convention
class MoDeL {
	static get environment() {
		const global = window as any
		if (global.__karma__) {
			return 'test'
		}

		if (environment !== 'production') {
			return 'development'
		}

		return 'production'
	}

	static get application() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return window.document.body.querySelector<Application>('[application]')!
	}
}

globalThis.MoDeL = MoDeL

type MoDeLClass = typeof MoDeL

declare global {
	type MoDeLEnvironment = 'development' | 'production' | 'test'
	var MoDeL: MoDeLClass
}