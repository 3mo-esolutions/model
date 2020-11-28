/* eslint-disable */

declare namespace MoDeL {
	type Environement = 'development' | 'production' | 'test'

	interface Globals {
		readonly environment: Environement
	}

	interface Permissions { }

	interface FeatureFlags { }

	interface LocalizationParametersMap {
		'Authenticated successfully': []
		'Incorrect Credentials': []
		'Password reset instructions have been sent to your email address': []
		'Password could not be reset': []
		'Something went wrong': []
		'Try again': []
		'Username': []
		'Password': []
		'Remember Password': []
		'Welcome': []
		'Login': []
	}

	type Localization = Record<keyof LocalizationParametersMap, string>
}

declare const MoDeL: MoDeL.Globals
declare function $<K extends keyof MoDeL.LocalizationParametersMap>(key: K, ...args: MoDeL.LocalizationParametersMap[K]): string

// @ts-ignore defining MoDeL
globalThis.MoDeL = new class {
	get environment() {
		const global = window as any
		if (global.__karma__)
			return 'test'

		if (global.describe?.() === 0)
			return 'development'

		return 'production'
	}

	get applicationHost() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return window.document.body.querySelector('mo-application-host')!
	}
}