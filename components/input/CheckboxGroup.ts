import { component, html, property } from '../../library'
import { Checkbox } from '..'
import { CSSDirection } from '../../types'

@component('mo-checkbox-group')
export class CheckboxGroup extends Checkbox {
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

	protected render = () => html`
		<style>
			:host {
				--mo-checkbox-group-nested-margin: 25px;
			}

			::slotted(*) {
				margin-left: var(--mo-checkbox-group-nested-margin);
			}
		</style>
		<mo-flex>
			${super.render()}
			<mo-flex direction=${this.direction} height='*' margin='0 0 0 calc(2 * var(--mo-thickness-xl))'>
				<slot></slot>
			</mo-flex>
		</mo-flex>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-checkbox-group': CheckboxGroup
	}
}