declare namespace MoDeL {
	type Environement = 'development' | 'production' | 'test'

	interface Globals {
		readonly environment: Environement
	}

}

declare const MoDeL: MoDeL.Globals

// @ts-ignore defining MoDeL
globalThis.MoDeL = new class {
	get environment() {
		const global = window as any
		if (global.__karma__)
			return 'test'

		if (global.webpackJsonp || global.describe?.() === 0)
			return 'development'

		return 'production'
	}

	get application() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return window.document.body.querySelector('#application')!
	}
}