import { component, property, componentize, InputElement } from '../../library'
import { CheckboxValue } from '../../types'
import { Checkbox as MwcCheckbox } from '@material/mwc-checkbox'
import { labelize } from './labelize'

@component('mo-checkbox')
export default class Checkbox extends labelize(componentize(MwcCheckbox)) implements InputElement<CheckboxValue> {
	@property()
	// @ts-ignore overriding the value property
	get value(): CheckboxValue {
		if (this.indeterminate)
			return 'indeterminate'
		else if (this.checked)
			return 'checked'
		else
			return 'unchecked'
	}

	set value(value: CheckboxValue) {
		if (value === 'indeterminate') {
			this.indeterminate = true
		} else if (value === 'checked') {
			this.indeterminate = false
			this.checked = true
		} else {
			this.indeterminate = false
			this.checked = false
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-checkbox': Checkbox
	}
}