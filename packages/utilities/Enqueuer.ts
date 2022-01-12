export class Enqueuer<T> {
	private timerId = -1

	enqueue(promise: Promise<T>) {
		return new Promise<T>((resolve, reject) => {
			window.clearTimeout(this.timerId)
			const currentTimerId = window.setTimeout(async () => {
				const result = await promise

				if (this.timerId !== currentTimerId) {
					return reject(new EnqueuerError(result))
				}

				resolve(result)
				this.timerId = -1
			})
			this.timerId = currentTimerId
		})
	}
}

export class EnqueuerError<T> extends Error {
	private static readonly message = 'The result of a promise has been discarded in favor of another one which has started afterwards.'

	constructor(readonly discardedResult: T, message = EnqueuerError.message) {
		super(message)
	}
}