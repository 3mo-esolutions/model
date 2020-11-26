/* eslint-disable */

declare namespace MDC {
	type Environement = 'development' | 'production' | 'test'

	interface Globals {
		readonly environment: Environement
	}

	interface Permissions { }

	interface FeatureFlags { }

	interface LocalizationParametersMap {
		'Authenticated successfully': [void]
		'Incorrect Credentials': [void]
		'Password reset instructions have been sent to your email address': [void]
		'Password could not be reset': [void]
		'Something went wrong': [void]
		'Try again': [void]
		'Username': [void]
		'Password': [void]
		'Remember Password': [void]
		'Welcome': [void]
		'Login': [void]
	}

	type Localization = Record<keyof LocalizationParametersMap, string>
}

declare const MDC: MDC.Globals
declare function $<K extends keyof MDC.LocalizationParametersMap>(key: K, ...args: MDC.LocalizationParametersMap[K]): string

// @ts-ignore defining MDC
globalThis.MDC = new class {
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
		return window.document.body.querySelector('mdc-application-host')!
	}
}