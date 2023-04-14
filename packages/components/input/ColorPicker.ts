import { component, html, event, ifDefined, nothing, property, css, Component, query } from '@a11d/lit'
import { Color } from '../../utilities'

/**
 * @element mo-color-picker
 *
 * @attr value - The current color.
 * @attr presets - A list of preset colors.
 *
 * @fires input - Dispatched when the user changes the color.
 * @fires change - Dispatched when the user commits the color.
 */
@component('mo-color-picker')
export class ColorPicker extends Component {
	@event() readonly input!: EventDispatcher<Color | undefined>
	@event() readonly change!: EventDispatcher<Color | undefined>

	@property({ type: Object }) value?: Color
	@property({ type: Array }) presets?: Array<Color>

	@query('input') protected readonly inputElement!: HTMLInputElement

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
			${this.inputTemplate}
			${this.datalistTemplate}
		`
	}

	protected get inputTemplate() {
		return html`
			<input id='input' part='input' type='color'
				list=${ifDefined(this.presets ? 'presetColors' : undefined)}
				.value=${this.value?.hex}
				@input=${(e: Event) => { e.stopImmediatePropagation(); this.value = this.inputColor; this.input.dispatch(this.inputColor) }}
				@change=${(e: Event) => { e.stopImmediatePropagation(); this.value = this.inputColor; this.change.dispatch(this.inputColor) }}
			>
		`
	}

	private get datalistTemplate() {
		return !this.presets ? nothing : html`
			<datalist id='presetColors'>
				${this.presets.map(color => html`<option>${color.hex}</option>`)}
			</datalist>
		`
	}

	protected get inputColor() {
		return this.presets?.find(p => p.hex === this.inputElement.value) ?? new Color(this.inputElement.value)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-color-picker': ColorPicker
	}
}