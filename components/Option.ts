import { component, property } from '../library'
import { ListItem } from './material'

@component('mo-option')
export default class Option<TValue = string> extends ListItem {
	@property({ type: Object }) rawValue?: TValue
	@property({ type: Boolean, reflect: true }) default = false

	getValue() {
		return this.rawValue ?? this.value as unknown as TValue
	}

	isValueEquals(value: TValue | undefined) {
		if (this.rawValue === value)
			return true

		if (typeof value === 'string')
			return this.value === value

		return false
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-option': Option
	}
}