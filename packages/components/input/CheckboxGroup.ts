import { component, html, property } from '../../library'
import { observeMutation } from '../../utilities'
import { Checkbox, CSSDirection } from '..'

@component('mo-checkbox-group')
export class CheckboxGroup extends Checkbox {
	@property() direction: CSSDirection = 'vertical'

	private get checkboxes() {
		return Array.from(this.children).filter(child => child instanceof Checkbox) as Array<Checkbox>
	}

	private get childrenValue(): CheckboxValue {
		if (this.checkboxes.every(e => e.value === 'checked')) {
			return 'checked'
		} else if (this.checkboxes.every(e => e.value === 'unchecked')) {
			return 'unchecked'
		} else {
			return 'indeterminate'
		}
	}

	private set childrenValue(value: CheckboxValue) {
		if (value === 'indeterminate') {
			return
		}

		this.checkboxes.forEach(checkbox => {
			checkbox.value = value
			checkbox.change.dispatch(value)
		})
	}

	protected override handleChange() {
		super.handleChange()
		this.childrenValue = this.value
	}

	protected override render() {
		return html`
			<style>
				:host {
					--mo-checkbox-group-nested-margin: 16px;
				}

				::slotted(*) {
					margin-left: var(--mo-checkbox-group-nested-margin);
				}
			</style>
			<mo-flex>
				${super.render()}
				<mo-flex direction=${this.direction} height='*' margin='0 0 0 calc(2 * var(--mo-thickness-xl))'>
					<slot ${observeMutation(this.handleSlotChange)}></slot>
				</mo-flex>
			</mo-flex>
		`
	}

	private readonly updateValue = () => this.value = this.childrenValue

	private readonly handleSlotChange = () => {
		this.updateValue()
		this.checkboxes.forEach(checkbox => checkbox.change.subscribe(this.updateValue))
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-checkbox-group': CheckboxGroup
	}
}