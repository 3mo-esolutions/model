import { component, html, property, renderContainer } from '../../../library'
import { FormatHelper } from '../../../utilities'
import { FieldNumber } from './FieldNumber'

@component('mo-field-percentage')
export class FieldPercentage extends FieldNumber {
	@property() percentageSign = '%'

	protected override initialized() {
		super.initialized()
		this.inputElement.min = '0'
		this.inputElement.max = '100'
	}

	protected override fromValue(value: number | undefined): string {
		return value ? FormatHelper.percent(value) : '0'
	}

	@renderContainer('slot[name="trailing"]')
	protected get percentageSignTemplate() {
		return html`
			<mo-div fontSize='var(--mo-font-size-l)'>
				${this.percentageSign}
			</mo-div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-percentage': FieldPercentage
	}
}