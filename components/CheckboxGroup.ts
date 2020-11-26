import { component, html, property } from '../library'
import { Checkbox } from './material'
import { CheckboxValue, CSSDirection } from '../types'

@component('mdc-checkbox-group')
export default class CheckboxGroup extends Checkbox {
	@property() direction: CSSDirection = 'vertical'

	protected initialized() {
		this.addEventListener('change', () => this.childrenValue = this.value)
		this.checkboxes.forEach(checkbox => checkbox.addEventListener('change', () => this.value = this.childrenValue))
	}

	private get checkboxes() {
		return Array.from(this.children).filter(elm => elm instanceof Checkbox) as Array<Checkbox>
	}

	private get childrenValue(): CheckboxValue {
		if (this.checkboxes.every(e => e.value === 'checked'))
			return 'checked'
		else if (this.checkboxes.every(e => e.value === 'unchecked'))
			return 'unchecked'
		else
			return 'indeterminate'
	}
	private set childrenValue(value: CheckboxValue) {
		if (value === 'indeterminate')
			return

		this.checkboxes.forEach(checkbox => {
			checkbox.value = value
			if (checkbox instanceof CheckboxGroup) {
				checkbox.childrenValue = value
			}
		})
	}

	protected render() {
		return html`
			<style>
				:host {
					--mdc-checkbox-group-nested-margin: 25px;
				}

				::slotted(*) {
					margin-left: var(--mdc-checkbox-group-nested-margin);
				}
			</style>
			<mdc-flex>
				${super.render()}
				<mdc-flex direction=${this.direction} height='*' margin='0 0 0 calc(2 * var(--mdc-thickness-xl))'>
					<slot></slot>
				</mdc-flex>
			</mdc-flex>
		`
	}
}