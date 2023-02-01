export class KeyboardHelper {
	private static _ctrl = false
	static get ctrl() { return this._ctrl }

	private static _shift = false
	static get shift() { return this._shift }

	private static _alt = false
	static get alt() { return this._alt }

	private static _meta = false
	static get meta() { return this._meta }

	static {
		window.addEventListener('keydown', e => {
			KeyboardHelper._ctrl = e.ctrlKey
			KeyboardHelper._shift = e.shiftKey
			KeyboardHelper._alt = e.altKey
			KeyboardHelper._meta = e.metaKey
		})

		window.addEventListener('keyup', e => {
			KeyboardHelper._ctrl = e.ctrlKey
			KeyboardHelper._shift = e.shiftKey
			KeyboardHelper._alt = e.altKey
			KeyboardHelper._meta = e.metaKey
		})

		window.addEventListener('blur', () => {
			KeyboardHelper._ctrl = false
			KeyboardHelper._shift = false
			KeyboardHelper._alt = false
			KeyboardHelper._meta = false
		})
	}
}