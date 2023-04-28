import { property, Component, component, html, css } from '@a11d/lit'
import { LocalStorage } from '@a11d/local-storage'
import * as Localization from '@3mo/localization'

// TODO: Deprecate this component

/**
 * @element mo-currency
 *
 * @deprecated Use .formatAsCurrency() on a number instead
 *
 * @attr currency - The currency code
 * @attr currencySymbol - The currency symbol
 * @attr signDisplay - The sign display
 * @attr redNegative - Whether to show negative amounts in red
 * @attr value - The amount
 */
@component('mo-currency')
export class Currency extends Component {
	static readonly redNegative = new LocalStorage('MoDeL.Components.Amount.RedNegative', false)

	@property({ type: Object }) currency = Localization.Currency.EUR
	@property({ type: String, reflect: true }) currencySymbol?: string
	@property({ type: String, reflect: true }) signDisplay?: Intl.NumberFormatOptions['signDisplay'] = 'auto'
	@property({ type: Boolean, reflect: true }) redNegative = Currency.redNegative.value
	@property({ type: Number, updated(this: Currency) { this.switchAttribute('negative', this.value < 0) } }) value = 0

	static override get styles() {
		return css`
			div {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				color: var(--mo-currency-color);
			}

			:host([negative][redNegative]) div {
				color: var(--mo-color-error);
			}

			span {
				color: inherit;
			}
		`
	}

	protected override get template() {
		return html`
			<div>
				<span>${this.amountText}</span>
				<span part='symbol'>${this.currencySymbolText}</span>
			</div>
		`
	}

	protected get amountText() {
		return this.value.formatAsCurrency({ signDisplay: this.signDisplay || 'auto' })
	}

	protected get currencySymbolText() {
		return this.currencySymbol ?? this.currency.symbol
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-currency': Currency
	}
}