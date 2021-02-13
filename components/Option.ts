import { component, property } from '../library'
import { ListItem } from './material'

@component('mo-option')
export class Option<TValue = string> extends ListItem {
	@property({ type: Object }) rawValue?: TValue
	@property({ type: Boolean, reflect: true }) default = false

	initialized() {
		super.initialized()
		this.style.maxWidth = '600px'
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