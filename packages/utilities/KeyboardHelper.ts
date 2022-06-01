export class KeyboardHelper {
	private static _ctrlPressed = false
	static get ctrlPressed() { return this._ctrlPressed }

	private static _shiftPressed = false
	static get shiftPressed() { return this._shiftPressed }

	private static _altPressed = false
	static get altPressed() { return this._altPressed }

	private static _metaPressed = false
	static get metaPressed() { return this._metaPressed }

	static initialize() {
		window.addEventListener('keydown', e => {
			KeyboardHelper._ctrlPressed = e.ctrlKey
			KeyboardHelper._shiftPressed = e.shiftKey
			KeyboardHelper._altPressed = e.altKey
			KeyboardHelper._metaPressed = e.metaKey
		})

		window.addEventListener('keyup', e => {
			KeyboardHelper._ctrlPressed = e.ctrlKey
			KeyboardHelper._shiftPressed = e.shiftKey
			KeyboardHelper._altPressed = e.altKey
			KeyboardHelper._metaPressed = e.metaKey
		})

		window.addEventListener('blur', () => {
			KeyboardHelper._ctrlPressed = false
			KeyboardHelper._shiftPressed = false
			KeyboardHelper._altPressed = false
			KeyboardHelper._metaPressed = false
		})
	}
}

KeyboardHelper.initialize()