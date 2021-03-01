import { css, html, property, ifDefined, query } from '../../library'
import { Input } from './Input'

export abstract class Field<T> extends Input<T> {
	@property({ reflect: true }) label = ''
	@property({ reflect: true }) pattern?: string
	@property({ type: Boolean, reflect: true }) readonly = false
	@property({ type: Boolean, reflect: true }) disabled = false
	@property({ type: Boolean, reflect: true }) required = false
	@property({ type: Boolean, reflect: true }) dense = false
	@property({ type: Boolean, reflect: true }) active = false

	@query('div[part="container"]') protected readonly divContainer!: HTMLDivElement

	static get styles() {
		return css`
			:host {
				--mo-field-height: 45px;
				--mo-field-label-scale-value-on-focus: 0.75;
				--mo-field-label-scale-on-focus: scale(var(--mo-field-label-scale-value-on-focus));
				--mo-field-label-translate-value-on-focus: -50%;
				--mo-field-label-translate-on-focus: translateY(var(--mo-field-label-translate-value-on-focus));
				--mo-field-label-transform-on-focus: var(--mo-field-label-translate-on-focus) var(--mo-field-label-scale-on-focus);
				--mo-field-label-top-on-focus: 15px;
				position: relative;
				display: flex;
				min-width: 0;
				
				border-radius: 5px 5px 0 0;
				background-color: var(--mdc-text-field-fill-color);
				border-bottom: 1px solid var(--mo-color-gray);
				padding: 0 8px;
				height: var(--mo-field-height);
				justify-content: center;
			}

			:host(:focus) {
				outline: none;
			}

			:host([dense]) {
				--mo-field-height: 32px;
				--mo-field-label-scale-value-on-focus: 1;
			}

			:host([disabled]) {
				pointer-events: none;
				opacity: 0.5;
			}

			:host([readonly]) {
				pointer-events: none;
			}

			:host(:focus), :host([active]), :host([open]) {
				border-bottom: 1px solid var(--mo-accent);
			}

			div[part=container] {
				margin: 0 5px;
				flex: 1;
				position: relative;
				height: var(--mo-field-height);
			}

			label {
				position: absolute;
				font-size: var(--mo-font-size-field);
				left: 0;
				top: calc(var(--mo-field-label-translate-value-on-focus) * -1);
				transform: var(--mo-field-label-translate-on-focus);
				color: var(--mo-color-gray);
				transition: .1s ease-out;
				transform-origin: left top;
				pointer-events: none;
				white-space: nowrap;
				overflow: hidden !important;
				text-overflow: ellipsis;
				max-width: 100%;
			}

			input {
				border: 0;
				width: 100%;
				font-size: var(--mo-font-size-field);
				outline: none;
				padding: 0.7rem 0 0 0;
				height: calc(100% - 0.7rem);
				color: var(--mo-color-foreground);
				transition: 0.1s ease-out;
				background-color: transparent;
				caret-color: var(--mo-accent);
			}

			input:focus input::placeholder {
				color: transparent;
			}
			
			:host([dense]) input {
				padding: 0;
				height: 100%;
			}

			:host([dense]) input:not(:placeholder-shown) ~ label {
				visibility: hidden;
			}

			:host(:focus) label, input:focus ~ label, :host([open]) label {
				color: var(--mo-accent);
				top: var(--mo-field-label-top-on-focus);
				transform: var(--mo-field-label-transform-on-focus);
			}

			:host(:focus) label, input:not(:placeholder-shown) ~ label, :host([open]) label {
				top: var(--mo-field-label-top-on-focus);
				transform: var(--mo-field-label-transform-on-focus);
			}

			slot {
				color: var(--mo-color-gray);
				display: flex;
				justify-content: center;
				align-items: center;
			}

			slot[name=leading] {
				justify-content: start;
			}

			slot[name=trailing] {
				justify-content: end;
			}

			slot[name=trailingInternal] {
				justify-content: end;
			}
		`
	}

	protected render() {
		return html`
			<slot name='leading'></slot>
			<div part='container'>
				<input
					id='input'
					part='input'
					placeholder=' '
					type='text'
					?readonly=${this.readonly}
					?required=${this.required}
					?disabled=${this.disabled}
					pattern=${ifDefined(this.pattern)}
					@focus=${() => this.active = true}
					@blur=${() => this.active = false}
				>
				<label for='input'>${this.label}</label>
			</div>
			<slot name='trailing'></slot>
			<slot name='trailingInternal'></slot>
		`
	}

	blur = () => this.inputElement.blur()
	focus = () => this.inputElement.focus()
	select = () => this.inputElement.select()
	setSelectionRange = (...args: Parameters<typeof HTMLInputElement.prototype.setSelectionRange>) => this.inputElement.setSelectionRange(...args)
	setRangeText = (...args: Parameters<typeof HTMLInputElement.prototype.setRangeText>) => this.inputElement.setRangeText(...args)
	setCustomValidity = (...args: Parameters<typeof HTMLInputElement.prototype.setCustomValidity>) => this.inputElement.setCustomValidity(...args)
	checkValidity = () => this.inputElement.checkValidity()
	reportValidity = () => this.inputElement.reportValidity()
}