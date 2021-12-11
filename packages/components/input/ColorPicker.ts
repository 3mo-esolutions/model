import { component, html, event, ifDefined, nothing, property, css } from '../../library'
import { Input } from '.'
import { Color } from '../../utilities'

@component('mo-color-picker')
export class ColorPicker extends Input<Color> {
	@event() private readonly input!: EventDispatcher<Color>

	@property({ type: Object })
	override get value() { return this._value }
	override set value(value) { this._value = value }

	@property({ type: Array }) presets?: Array<Color>

	protected override firstUpdated() {
		super.firstUpdated()
		this.inputElement.addEventListener('input', e => {
			e.stopImmediatePropagation()
			this.input.dispatch(this.toValue(this.inputElement.value))
		})
	}

	static override get styles() {
		return css`
			:host {
				display: flex;
				align-items: center;
				justify-content: center;
			}

			input {
				width: 100%;
				margin: 0;
				padding: 0;
				border: 0;
			}
		`
	}

	protected override get template() {
		return html`
			<input id='input' part='input' type='color'
				list=${ifDefined(this.presets ? 'presetColors' : undefined)}
				value=${ifDefined(this.value?.baseHex)}
			>
			${this.datalistTemplate}
		`
	}

	private get datalistTemplate() {
		return !this.presets ? nothing : html`
			<datalist id='presetColors'>
				${this.presets.map(color => html`
					<option>${color.baseHex}</option>
				`)}
			</datalist>
		`
	}

	protected fromValue(value: Color | undefined) {
		return value?.baseHex ?? ''
	}

	protected toValue(value: string) {
		return this.presets?.find(p => p.baseHex === value) ?? new Color(value as any)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-color-picker': ColorPicker
	}
}