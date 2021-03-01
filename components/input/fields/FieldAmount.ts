import { component, html, renderContainer } from '../../../library'
import { FormatHelper } from '../../../helpers'
import { FieldNumber } from './FieldNumber'

@component('mo-field-amount')
export class FieldAmount extends FieldNumber {
	protected fromValue(value: number | undefined): string {
		return typeof value === 'number' ? FormatHelper.amount(value) : ''
	}

	@renderContainer('slot[name="trailing"]')
	protected get currencySymbolTemplate() {
		return html`
			<mo-div fontSize='var(--mo-font-size-xl)'>${FormatHelper.Currency.Symbol.value}</mo-div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-amount': FieldAmount
	}
}