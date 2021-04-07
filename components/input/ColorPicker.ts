import { component, html, event, property } from '../../library'
import { Color } from '../../types'
import { Input } from '.'

@component('mo-color-picker')
export class ColorPicker extends Input<Color> {
	@event() private readonly input!: IEvent<Color>

	@property({ type: Object })
	get value() { return this._value }
	set value(value) { this._value = value }

	protected initialized() {
		super.initialized()
		this.inputElement.addEventListener<any>('input', (e: CustomEvent<undefined, HTMLInputElement>) => {
			e.stopImmediatePropagation()
			this.input.dispatch(this.toValue(e.source.value))
		})
	}

	protected render() {
		return html`
			<input id='input' part='input' type='color'>
		`
	}

	protected fromValue(value: Color | undefined) {
		return value?.cssHex ?? ''
	}

	protected toValue(value: string) {
		return new Color(value)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-color-picker': ColorPicker
	}
}