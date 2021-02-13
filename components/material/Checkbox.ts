import { component, property, ComponentMixin } from '../../library'
import { Checkbox as MwcCheckbox } from '@material/mwc-checkbox'
import { LabelMixin } from './LabelMixin'
import { InputMixin } from './InputMixin'

/**
 * @attr checked
 * @attr indeterminate
 * @attr disabled
 * @attr value
 */
@component('mo-checkbox')
export class Checkbox extends InputMixin(LabelMixin(ComponentMixin(MwcCheckbox))) {
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
	type CheckboxValue = 'checked' | 'unchecked' | 'indeterminate'
	interface HTMLElementTagNameMap {
		'mo-checkbox': Checkbox
	}
}