class NotImplementedError extends Error {
	constructor(message = 'Not implemented.') {
		super(message)
	}
}

// @ts-expect-error NotImplementedError is global
globalThis.NotImplementedError = NotImplementedError