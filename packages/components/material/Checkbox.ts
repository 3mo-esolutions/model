import { component, property, ComponentMixin, css } from '../../library'
import { LabelMixin, InputMixin } from '../helpers'
import { Checkbox as MwcCheckbox } from '@material/mwc-checkbox'

/**
 * @attr checked
 * @attr indeterminate
 * @attr disabled
 * @attr value
 */
@component('mo-checkbox')
export class Checkbox extends InputMixin(LabelMixin(ComponentMixin(MwcCheckbox))) {
	static override get styles() {
		return [
			...super.styles,
			...MwcCheckbox.styles,
			css`
				:host {
					--mdc-checkbox-touch-target-size: 36px;
					--mdc-checkbox-ripple-size: 36px;
					--mdc-checkbox-disabled-color: var(--mo-color-gray-transparent);
					--mdc-checkbox-unchecked-color: var(--mo-color-foreground-transparent);
					--mdc-checkbox-ink-color: var(--mo-color-accessible);
				}
			`
		]
	}

	@property()
	// @ts-expect-error overriding the value property
	get value(): CheckboxValue {
		if (this.indeterminate) {
			return 'indeterminate'
		} else if (this.checked) {
			return 'checked'
		} else {
			return 'unchecked'
		}
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

	override reducedTouchTarget = true
}

declare global {
	type CheckboxValue = 'checked' | 'unchecked' | 'indeterminate'
	interface HTMLElementTagNameMap {
		'mo-checkbox': Checkbox
	}
}