import { css, html, property, ifDefined, query, event, PropertyValues } from '../../library'
import { Input } from './Input'

export type FieldInputType =
	| 'text'
	| 'search'
	| 'tel'
	| 'url'
	| 'email'
	| 'password'
	| 'datetime'
	| 'date'
	| 'month'
	| 'week'
	| 'time'
	| 'datetime-local'
	| 'number'
	| 'color'

export type FieldInputMode =
	| 'none'
	| 'text'
	| 'decimal'
	| 'numeric'
	| 'tel'
	| 'search'
	| 'email'
	| 'url'

export type FieldAutoComplete =
	| 'on'
	| 'off'
	| 'name'
	| 'honorific-prefix'
	| 'given-name'
	| 'additional-name'
	| 'family-name'
	| 'honorific-suffix'
	| 'nickname'
	| 'username'
	| 'new-password'
	| 'current-password'
	| 'one-time-code'
	| 'organization-title'
	| 'organization'
	| 'street-address'
	| 'address-line1'
	| 'address-line2'
	| 'address-line3'
	| 'address-level4'
	| 'address-level3'
	| 'address-level2'
	| 'address-level1'
	| 'country'
	| 'country-name'
	| 'postal-code'
	| 'cc-name'
	| 'cc-given-name'
	| 'cc-additional-name'
	| 'cc-family-name'
	| 'cc-number'
	| 'cc-exp'
	| 'cc-exp-month'
	| 'cc-exp-year'
	| 'cc-csc'
	| 'cc-type'
	| 'transaction-currency'
	| 'transaction-amount'
	| 'language'
	| 'bday'
	| 'bday-day'
	| 'bday-month'
	| 'bday-year'
	| 'sex'
	| 'url'
	| 'photo'
	| 'tel'
	| 'tel-country-code'
	| 'tel-national'
	| 'tel-area-code'
	| 'tel-local'
	| 'tel-local-prefix'
	| 'tel-local-suffix'
	| 'tel-extension'
	| 'impp'

/**
 * @slot leading
 * @slot trailing
 * @fires input {CustomEvent<T | undefined>}
 */
export abstract class Field<T> extends Input<T> {
	@event() readonly input!: EventDispatcher<T | undefined>

	@property({ reflect: true }) label = ''
	@property({ reflect: true }) pattern?: string
	@property({ reflect: true }) autoComplete?: FieldAutoComplete
	@property({ reflect: true }) override inputMode: FieldInputMode = 'text'
	@property({ type: Boolean, reflect: true }) readonly = false
	@property({ type: Boolean, reflect: true }) disabled = false
	@property({ type: Boolean, reflect: true }) required = false
	@property({ type: Boolean, reflect: true }) dense = false
	@property({ type: Boolean, reflect: true }) active = false
	@property({ type: Boolean, reflect: true }) selectOnFocus = false

	@query('div[part="container"]') protected readonly divContainer!: HTMLDivElement
	trailingInternal: any

	protected inputType: FieldInputType = 'text'

	override get value() { return super.value }
	override set value(value) {
		super.value = value
		Promise.delegateToEventLoop(() => this.checkValidity())
	}

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.registerInputElementEvents()
		Promise.delegateToEventLoop(() => this.checkValidity())
	}

	protected registerInputElementEvents() {
		this.inputElement.addEventListener('input', (e: Event) => {
			e.stopPropagation()
			this.handleInput()
		})
	}

	protected handleInput() {
		this.checkValidity()
		this.input.dispatch(this.toValue(this.inputElement.value))
		this.requestUpdate()
	}

	static override get styles() {
		return css`
			:host {
				--mo-field-height: 40px;
				--mo-field-label-scale-value-on-focus: 0.75;
				--mo-field-label-scale-on-focus: scale(var(--mo-field-label-scale-value-on-focus));
				--mo-field-label-translate-value-on-focus: -50%;
				--mo-field-label-translate-on-focus: translateY(var(--mo-field-label-translate-value-on-focus));
				--mo-field-label-transform-on-focus: var(--mo-field-label-translate-on-focus) var(--mo-field-label-scale-on-focus);
				--mo-field-label-top-on-focus: 14px;
				--mo-field-border-top-left-radius: var(--mo-border-radius);
				--mo-field-border-top-right-radius: var(--mo-border-radius);
				--mdc-icon-size: var(--mo-font-size-icon, 20px);
				position: relative;
				display: grid;
				grid-template-columns: auto 1fr auto auto;
				min-width: 0;

				border-top-left-radius: var(--mo-field-border-top-left-radius);
				border-top-right-radius: var(--mo-field-border-top-right-radius);
				box-sizing: border-box;
				background-color: var(--mo-field-background);
				border-bottom: 1px solid var(--mo-color-gray-transparent);
				padding: 0 10px;
				gap: 6px;
				height: var(--mo-field-height);
				justify-content: center;
			}

			:host(:focus) {
				outline: none;
			}

			:host([dense]) {
				--mo-field-height: 32px;
				--mo-field-label-scale-value-on-focus: 1;
				--mo-field-label-top-on-focus: 16px;
			}

			:host([disabled]) {
				pointer-events: none;
				opacity: 0.5;
			}

			:host([readonly]) slot[name=trailing], :host([readonly]) slot[name=trailingInternal] {
				pointer-events: none;
			}

			:host([readonly]) input {
				caret-color: transparent;
			}

			:host(:focus), :host([active]), :host([open]) {
				border-bottom: 1px solid var(--mo-accent);
			}

			div[part=container] {
				display: grid;
				flex: 1;
				position: relative;
				height: var(--mo-field-height);
			}

			label {
				position: absolute;
				font-size: var(--mo-field-font-size);
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

			:host:after {
				--mo-field-initial-outline-width: 10px;
				content: '';
				position: absolute;
				bottom: -1px;
				height: 2px;
				left: calc(calc(100% - var(--mo-field-initial-outline-width)) / 2);
				width: var(--mo-field-initial-outline-width);
				visibility: hidden;
				background-color: var(--mo-accent);
				transition: 0.2s ease all;
			}

			:host([active]):after, :host([open]):after {
				visibility: visible;
				width: 100%;
				left: 0px;
			}

			input {
				border: 0px;
				width: 100%;
				font-size: var(--mo-field-font-size);
				outline: none;
				padding: 0.8rem 0 0 0;
				height: calc(100% - 0.8rem);
				color: var(--mo-color-foreground);
				transition: 0.1s ease-out;
				background-color: transparent;
				caret-color: var(--mo-accent);
				text-align: inherit;
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

			:host(:focus) label, input:focus ~ label, :host([open]) label, input:not(:placeholder-shown) ~ label {
				font-size: var(--mo-field-font-size);
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

			:host([invalid]) {
				border-bottom: 1px solid var(--mo-color-error);
			}

			:host([invalid]):after {
				background-color: var(--mo-color-error);
			}

			:host([invalid]) input {
				caret-color: var(--mo-color-error);
			}

			:host([invalid]) label {
				color: var(--mo-color-error);
			}

			slot {
				color: var(--mo-color-gray);
				display: flex;
				justify-content: center;
				align-items: center;
				
			}

			/* slot[name=trailing] mo-icon-button,  slot[name=trailingInternal] mo-icon-button {
				margin-right: -6px;
			} */
		`
	}

	protected override get template() {
		return html`
			<slot name='leading'></slot>
			<div part='container'>
				<input
					id='input'
					part='input'
					placeholder=' '
					autocomplete=${ifDefined(this.autoComplete)}
					type=${this.inputType}
					inputmode=${this.inputMode}
					?readonly=${this.readonly}
					?required=${this.required}
					?disabled=${this.disabled}
					pattern=${ifDefined(this.pattern)}
					@focus=${() => this.handleFocus()}
					@blur=${() => this.handleBlur()}
				>
				<label for='input'>${this.label} ${this.required ? '*' : ''}</label>
			</div>
			<slot name='trailing'></slot>
			<slot name='trailingInternal'></slot>
		`
	}

	protected handleFocus() {
		this.checkValidity()
		this.active = true
		if (this.selectOnFocus) {
			this.select()
		}
	}

	protected handleBlur() {
		this.active = false
	}

	override blur = () => this.inputElement.blur()
	override focus = () => this.inputElement.focus()
	select = () => this.inputElement.select()
	setSelectionRange = (...args: Parameters<typeof HTMLInputElement.prototype.setSelectionRange>) => this.inputElement.setSelectionRange(...args)
	setRangeText = (...args: Parameters<typeof HTMLInputElement.prototype.setRangeText>) => this.inputElement.setRangeText(...args)
	setCustomValidity = (...args: Parameters<typeof HTMLInputElement.prototype.setCustomValidity>) => this.inputElement.setCustomValidity(...args)
	checkValidity = () => {
		const isValid = this.inputElement?.checkValidity() ?? true
		this.switchAttribute('invalid', isValid === false)
		return isValid
	}
	reportValidity = () => this.inputElement.reportValidity()
}