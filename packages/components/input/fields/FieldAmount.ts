import { component, html, property, renderContainer } from '../../../library'
import { FormatHelper } from '../../../utilities'
import { FieldNumber } from './FieldNumber'

@component('mo-field-amount')
export class FieldAmount extends FieldNumber {
	@property() currency = CurrencyCode.EUR
	@property() currencySymbol?: string

	protected override fromValue(value: number | undefined) {
		return typeof value === 'number' ? FormatHelper.amount(value) : ''
	}

	@renderContainer('slot[name="trailing"]')
	protected get currencySymbolTemplate() {
		return html`
			<mo-div fontSize='var(--mo-font-size-xl)'>${this.currencySymbolText}</mo-div>
		`
	}

	protected get currencySymbolText() {
		return this.currencySymbol ?? FormatHelper.getCurrencySymbol(this.currency)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-amount': FieldAmount
	}
}