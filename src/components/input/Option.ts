import { component, property, css, event } from '../../library'
import { ListItemCheckbox } from '../material'

@component('mo-option')
export class Option<TValue> extends ListItemCheckbox {
	@event({ bubbles: true }) private readonly defaultClick!: EventDispatcher

	@property({ type: Object }) data?: TValue
	@property({ type: Boolean, reflect: true, observer: defaultChanged }) default = false
	@property({ type: Boolean, reflect: true }) multiple = false

	static get styles() {
		return [
			super.styles,
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

	initialized() {
		super.initialized()
		if (!this.value) {
			this.value = this.innerText || Array.from(this.parentElement?.children ?? []).indexOf(this).toString()
		}
		this.onclick = () => {
			if (this.default) {
				this.defaultClick.dispatch()
			}
		}
	}
}

function defaultChanged(this: Option<unknown>) {
	if (!this.default) {
		return
	}

	this.data = undefined
	this.value = undefined!
	this.disabled = true
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-option': Option<unknown>
	}
}