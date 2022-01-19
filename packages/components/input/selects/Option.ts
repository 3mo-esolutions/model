import { component, property, css, event } from '../../../library'
import { ListItemCheckbox } from '../../material'

@component('mo-option')
export class Option<TData> extends ListItemCheckbox {
	@event({ bubbles: true }) private readonly defaultClick!: EventDispatcher

	@property({ type: Object }) data?: TData
	@property({ type: Boolean, reflect: true }) multiple = false
	@property() inputText?: string
	@property({
		type: Boolean,
		reflect: true,
		updated(this: Option<TData>) {
			if (!this.default) {
				return
			}

			this.data = undefined
			this.value = undefined!
			this.disabled = true
		}
	}) default = false

	override get text() {
		return this.inputText ?? super.text
	}

	static override get styles() {
		return [
			...super.styles,
			css`
				:host(:not([multiple])) .mdc-deprecated-list-item__meta {
					display: none;
				}

				:host([default]) {
					cursor: pointer;
					pointer-events: auto;
				}
			`
		] as any
	}

	protected override initialized() {
		super.initialized()
		if (!this.value) {
			this.value = this.textContent || Array.from(this.parentElement?.children ?? []).indexOf(this).toString()
		}
		this.onclick = () => {
			if (this.default) {
				this.defaultClick.dispatch()
			}
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-option': Option<unknown>
	}
}