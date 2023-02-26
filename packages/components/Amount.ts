import { property, Component, component, html, css } from '@a11d/lit'
import { FormatHelper } from '../utilities'
import { LocalStorage } from '@a11d/local-storage'

/**
 * @element mo-amount
 *
 * @attr currency - The currency code
 * @attr currencySymbol - The currency symbol
 * @attr signDisplay - The sign display
 * @attr redNegative - Whether to show negative amounts in red
 * @attr value - The amount
 */
@component('mo-amount')
export class Amount extends Component {
	static readonly redNegative = new LocalStorage('MoDeL.Components.Amount.RedNegative', false)

	@property() currency = CurrencyCode.EUR
	@property({ type: String, reflect: true }) currencySymbol?: string
	@property({ type: String, reflect: true }) signDisplay?: Intl.NumberFormatOptions['signDisplay'] = 'auto'
	@property({ type: Boolean, reflect: true }) redNegative = Amount.redNegative.value
	@property({ type: Number, updated(this: Amount) { this.switchAttribute('negative', this.value < 0) } }) value = 0

	static override get styles() {
		return css`
			div {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				color: var(--mo-amount-color);
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
		return FormatHelper.amount(this.value, { signDisplay: this.signDisplay || 'auto' })
	}

	protected get currencySymbolText() {
		return this.currencySymbol ?? FormatHelper.getCurrencySymbol(this.currency)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-amount': Amount
	}
}