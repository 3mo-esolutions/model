import { component, css } from '../../../library'
import { FieldSelectBase } from './FieldSelectBase'

@component('mo-field-select')
export class FieldSelect<T> extends FieldSelectBase<T, false> {
	protected defaultValue = undefined

	protected toValue() {
		return this.selectedOptions?.value
	}

	protected getValueOptions(value: string | undefined) {
		const option = this.options.find(option => option.value === value)
		return option ? [option] : []
	}

	protected initialized() {
		super.initialized()
		this.inputElement.readOnly = true
		this.divContainer.addEventListener('click', () => this.open = true)
		this.inputElement.addEventListener('focus', () => this.inputElement.setSelectionRange(0, 0))
	}

	static get styles() {
		return css`
			${super.styles}

			input:hover {
				cursor: pointer;
			}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-select': FieldSelect<unknown>
	}
}