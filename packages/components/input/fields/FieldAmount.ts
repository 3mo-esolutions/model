import { component, html, property, style } from '../../../library'
import { FormatHelper } from '../../../utilities'
import { FieldNumber } from './FieldNumber'

@component('mo-field-amount')
export class FieldAmount extends FieldNumber {
	@property() currency = CurrencyCode.EUR
	@property() currencySymbol?: string

	protected override fromValue(value: number | undefined) {
		return typeof value === 'number' ? FormatHelper.amount(value) : ''
	}

	protected get currencySymbolText() {
		return this.currencySymbol ?? FormatHelper.getCurrencySymbol(this.currency)
	}

	protected override get template() {
		return html`
			${super.template}
			<div ${style({ color: 'var(--mo-color-gray)', fontSize: 'var(--mo-font-size-xl)' })}>${this.currencySymbolText}</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-amount': FieldAmount
	}
}