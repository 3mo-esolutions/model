import { component, html, property, renderContainer } from '../../../library'
import { FormatHelper } from '../../../utilities'
import { FieldNumber } from './FieldNumber'

@component('mo-field-amount')
export class FieldAmount extends FieldNumber {
	@property() currency = FormatHelper.storage.currency.symbol.value

	protected override fromValue(value: number | undefined): string {
		return typeof value === 'number' ? FormatHelper.amount(value) : ''
	}

	@renderContainer('slot[name="trailing"]')
	protected get currencySymbolTemplate() {
		return html`
			<mo-div fontSize='var(--mo-font-size-xl)'>${this.currency}</mo-div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-amount': FieldAmount
	}
}