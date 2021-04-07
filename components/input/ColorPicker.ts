import { component, html, event, ifDefined, nothing, property } from '../../library'
import { Color } from '../../types'
import { Input } from '.'

@component('mo-color-picker')
export class ColorPicker extends Input<Color> {
	@event() private readonly input!: IEvent<Color>

	@property({ type: Object })
	get value() { return this._value }
	set value(value) { this._value = value }

	@property({ type: Array }) presets?: Array<Color>

	protected initialized() {
		super.initialized()
		this.inputElement.addEventListener<any>('input', (e: CustomEvent<undefined, HTMLInputElement>) => {
			e.stopImmediatePropagation()
			this.input.dispatch(this.toValue(e.source.value))
		})
	}

	protected render() {
		return html`
			<style>
				:host {
					display: flex;
					align-items: center;
					justify-content: center;
				}

				input {
					margin: 0;
					padding: 0;
					border: 0;
				}
			</style>
			<input id='input' part='input' type='color'
				list=${ifDefined(this.presets ? 'presetColors' : undefined)}
				value=${ifDefined(this.value?.hex)}
			>
			${this.datalistTemplate}
		`
	}

	private get datalistTemplate() {
		return !this.presets ? nothing : html`
			<datalist id='presetColors'>
				${this.presets.map(color => html`
					<option>${color.hex}</option>
				`)}
			</datalist>
		`
	}

	protected fromValue(value: Color | undefined) {
		return value?.hex ?? ''
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