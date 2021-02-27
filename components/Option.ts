import { component, property, css } from '../library'
import { ListItemCheckbox } from './material'

@component('mo-option')
export class Option<TValue = string> extends ListItemCheckbox {
	@property({ type: Object }) rawValue?: TValue
	@property({ type: Boolean, reflect: true }) default = false
	@property({ type: Boolean, reflect: true }) multiple = true

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

	getValue() {
		if (this.default)
			return undefined

		return this.rawValue ?? this.value as unknown as TValue
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-option': Option
	}
}