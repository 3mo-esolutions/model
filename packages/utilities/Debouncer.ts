export class Debouncer {
	private timerId = -1

	debounce(delay: number) {
		return new Promise<void>(resolve => {
			window.clearTimeout(this.timerId)
			this.timerId = window.setTimeout(() => {
				resolve()
				this.timerId = -1
			}, delay)
		})
	}
}