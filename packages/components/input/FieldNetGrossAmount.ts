import { component, css, html, ifDefined, property, style } from '@a11d/lit'
import { FormatHelper } from '../../utilities'
import { Field } from './Field'

@component('mo-field-net-gross-amount')
export class FieldNetGrossAmount extends Field<NetGrossAmount> {
	@property({ type: Boolean }) isGross = false
	@property() currency = CurrencyCode.EUR
	@property() currencySymbol?: string

	protected fromValue(value?: NetGrossAmount) {
		this.isGross = value?.[1] ?? false
		return typeof value?.[0] === 'number' ? FormatHelper.amount(value[0]) : ''
	}

	protected toValue(value: string): NetGrossAmount {
		return [
			FormatHelper.localNumberToNumber(value),
			this.isGross,
		]
	}

	static override get styles() {
		return css`
			${super.styles}

			button {
				cursor: pointer;
				border: none;
				background: transparent;
				color: var(--mo-color-foreground);
				border-radius: var(--mo-border-radius)
			}

			button:hover {
				background: var(--mo-color-transparent-gray-3);
			}

			button[data-selected] {
				color: var(--mo-color-accessible);
				background-color: var(--mo-color-accent);
			}
		`
	}

	protected override get template() {
		return html`
			${super.template}
			<mo-flex direction='horizontal' gap='4px' alignItems='center'>
				<mo-flex gap='2px' direction=${ifDefined(this.dense ? 'horizontal' : undefined)}>
					<button tabindex='-1'
						?data-selected=${!this.isGross}
						@click=${() => this.setIsGross(false)}
					>N</button>

					<button tabindex='-1'
						?data-selected=${this.isGross}
						@click=${() => this.setIsGross(true)}
					>B</button>
				</mo-flex>

				<div ${style({ fontSize: 'var(--mo-font-size-xl)' })}>
					${this.currencySymbol ?? FormatHelper.getCurrencySymbol(this.currency)}
				</div>
			</mo-flex>
		`
	}

	protected setIsGross(value: boolean) {
		if (this.isGross !== value) {
			this.isGross = value
			this.handleChange()
		}
	}
}

declare global {
	type NetGrossAmount = [amount: number | undefined, isGross: boolean]
	interface HTMLElementTagNameMap {
		'mo-field-net-gross-amount': FieldNetGrossAmount
	}
}