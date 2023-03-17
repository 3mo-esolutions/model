import { component, html, property, style } from '@a11d/lit'
import { Currency } from '@3mo/localization'
import { FieldNumber } from './FieldNumber'

@component('mo-field-currency')
export class FieldCurrency extends FieldNumber {
	@property({ type: Object }) currency = Currency.EUR
	@property() currencySymbol?: string

	protected override fromValue(value: number | undefined) {
		return typeof value === 'number' ? value.formatAsCurrency() : ''
	}

	protected get currencySymbolText() {
		return this.currencySymbol ?? this.currency.symbol
	}

	protected override get template() {
		return html`
			${super.template}
			<div @click=${() => this.focus()} ${style({ color: 'var(--mo-color-gray)', fontSize: 'var(--mo-font-size-xl)' })}>${this.currencySymbolText}</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-currency': FieldCurrency
	}
}