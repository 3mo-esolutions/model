import { component, property, css } from '../library'
import { ListItemCheckbox } from './material'

@component('mo-option')
export class Option<TValue = string> extends ListItemCheckbox {
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
			`
		] as any
	}

	initialized() {
		super.initialized()
		this.selectionChange.subscribe(() => {
			if (this.default === true) {
				this.selected = false
			}
		})
	}
}

function defaultChanged(this: Option<unknown>) {
	if (!this.default)
		return

	this.data = undefined
	this.value = undefined!
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-option': Option
	}
}