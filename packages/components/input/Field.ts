import { css, html, property, ifDefined, query, event, PropertyValues } from '../../library'
import { Input } from './Input'

export type FieldInputMode =
	| 'none'
	| 'text'
	| 'decimal'
	| 'numeric'
	| 'tel'
	| 'search'
	| 'email'
	| 'url'

/**
 * @slot leading
 * @slot trailing
 * @fires input {CustomEvent<T | undefined>}
 */
export abstract class Field<T> extends Input<T> {
	@event() readonly input!: EventDispatcher<T | undefined>

	@property({ reflect: true }) label = ''
	@property({ reflect: true }) pattern?: string
	@property({ reflect: true }) override inputMode: FieldInputMode = 'text'
	@property({ type: Boolean, reflect: true }) readonly = false
	@property({ type: Boolean, reflect: true }) disabled = false
	@property({ type: Boolean, reflect: true }) required = false
	@property({ type: Boolean, reflect: true }) dense = false
	@property({ type: Boolean, reflect: true }) active = false
	@property({ type: Boolean, reflect: true }) selectOnFocus = false

	@query('div[part="container"]') protected readonly divContainer!: HTMLDivElement

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.registerInputElementEvents()
	}

	protected registerInputElementEvents() {
		this.inputElement.addEventListener('input', (e: Event) => {
			e.stopPropagation()
			this.handleInput()
		})
	}

	protected handleInput() {
		this.input.dispatch(this.toValue(this.inputElement.value))
		this.requestUpdate()
	}

	static override get styles() {
		return css`
			:host {
				--mo-field-height: 45px;
				--mo-field-label-scale-value-on-focus: 0.75;
				--mo-field-label-scale-on-focus: scale(var(--mo-field-label-scale-value-on-focus));
				--mo-field-label-translate-value-on-focus: -50%;
				--mo-field-label-translate-on-focus: translateY(var(--mo-field-label-translate-value-on-focus));
				--mo-field-label-transform-on-focus: var(--mo-field-label-translate-on-focus) var(--mo-field-label-scale-on-focus);
				--mo-field-label-top-on-focus: 15px;
				--mo-field-border-top-left-radius: var(--mo-border-radius);
				--mo-field-border-top-right-radius: var(--mo-border-radius);
				position: relative;
				display: grid;
				grid-template-columns: auto 1fr auto auto;
				min-width: 0;

				border-top-left-radius: var(--mo-field-border-top-left-radius);
				border-top-right-radius: var(--mo-field-border-top-right-radius);
				box-sizing: border-box;
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

			:host([disabled]) div[part=container], :host([disabled]) slot[name=trailingInternal] {
				pointer-events: none;
				opacity: 0.5;
			}

			:host([readonly]) div[part=container], :host([readonly]) slot[name=trailingInternal] {
				pointer-events: none;
			}

			:host(:focus), :host([active]), :host([open]) {
				border-bottom: 1px solid var(--mo-accent);
			}

			div[part=container] {
				display: grid;
				margin: 0 5px;
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
				height: var(--mo-field-height);
			}

			slot[name=trailing] {
				justify-content: end;
				height: var(--mo-field-height);
			}

			slot[name=trailingInternal] {
				justify-content: end;
				height: var(--mo-field-height);
			}
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
					type='text'
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
	checkValidity = () => this.inputElement.checkValidity()
	reportValidity = () => this.inputElement.reportValidity()
}