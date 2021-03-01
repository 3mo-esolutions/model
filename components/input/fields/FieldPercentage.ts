import { component, html, renderContainer } from '../../../library'
import { FormatHelper } from '../../../helpers'
import { FieldNumber } from './FieldNumber'

@component('mo-field-percentage')
export class FieldPercentage extends FieldNumber {
	protected initialized() {
		super.initialized()
		this.inputElement.min = '0'
		this.inputElement.max = '100'
	}

	protected fromValue(value: number | undefined): string {
		return value ? FormatHelper.percent(value) : '0'
	}

	@renderContainer('slot[name="trailing"]')
	protected get percentageSignTemplate() {
		return html`
			<mo-div fontSize='var(--mo-font-size-l)'>%</mo-div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-percentage': FieldPercentage
	}
}