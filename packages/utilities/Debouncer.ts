export class Debouncer {
	static debounce(delay: number) {
		return new Debouncer().debounce(delay)
	}

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