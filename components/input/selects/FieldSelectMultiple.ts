import { component, css } from '../../../library'
import { FieldSelectBase } from './FieldSelectBase'

@component('mo-field-select-multiple')
export class FieldSelectMultiple<T> extends FieldSelectBase<T, true> {
	protected defaultValue = []

	protected toValue() {
		return this.selectedOptions?.map(o => o.value).filter(o => !!o)
	}

	protected getValueOptions(value: Array<string>) {
		return value ? this.options.filter(o => value.map(v => v).includes(o.value)) : []
	}

	protected initialized() {
		super.initialized()
		this.inputElement.readOnly = true
		this.menuOptions!.multi = true
		this.menuOptions!.manualClose = true
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
		'mo-field-select-multiple': FieldSelectMultiple<unknown>
	}
}