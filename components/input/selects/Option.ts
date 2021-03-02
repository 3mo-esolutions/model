import { component, property, css } from '../../../library'
import { ListItemCheckbox } from '../../material'

@component('mo-option')
export class Option<TValue> extends ListItemCheckbox {
	@property({ type: Object }) data?: TValue
	@property({ type: Boolean, reflect: true, observer: defaultChanged }) default = false
	@property({ type: Boolean, reflect: true }) multiple = false

	static get styles() {
		return [
			super.styles,
			css`
				:host(:not([multiple])) .mdc-list-item__meta {
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
			this.value = Array.from(this.parentElement.children).indexOf(this).toString()
		}
	}
}

function defaultChanged(this: Option<unknown>) {
	if (!this.default)
		return

	this.data = undefined
	this.value = undefined!
	this.disabled = true
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-option': Option<unknown>
	}
}