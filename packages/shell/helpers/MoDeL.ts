declare namespace MoDeL {
	type Environment = 'development' | 'production' | 'test'

	interface Globals {
		readonly environment: Environment
	}
}

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const MoDeL: MoDeL.Globals
declare const environment: string

// @ts-ignore defining MoDeL
globalThis.MoDeL = new class {
	get environment() {
		const global = window as any
		if (global.__karma__) {
			return 'test'
		}

		if (environment !== 'production') {
			return 'development'
		}

		return 'production'
	}

	get application() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return window.document.body.querySelector('[application]')!
	}
}