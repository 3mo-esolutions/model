import { component, css, eventListener, html, property } from '../../library'
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
			if (checkbox.value !== value) {
				checkbox.value = value
				checkbox.change.dispatch(value)
			}
		})
	}

	@eventListener('change')
	protected changed = () => this.childrenValue = this.value

	static override get styles() {
		return [...super.styles, css`
			:host {
				--mo-checkbox-group-nested-margin: 32px;
			}

			::slotted(*) {
				margin-left: var(--mo-checkbox-group-nested-margin);
			}
		`]
	}

	protected override render() {
		return html`
			<mo-flex>
				${super.render()}
				<mo-flex direction=${this.direction} height='*'>
					<slot ${observeMutation(this.handleSlotChange)}></slot>
				</mo-flex>
			</mo-flex>
		`
	}

	private readonly updateValue = () => {
		const value = this.childrenValue
		if (value !== this.value) {
			this.value = value
			this.change.dispatch(value)
		}
	}

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