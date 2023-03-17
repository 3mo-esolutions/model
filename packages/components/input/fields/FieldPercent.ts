import { component, html, property, style } from '@a11d/lit'
import { FieldNumber } from './FieldNumber'

@component('mo-field-percent')
export class FieldPercent extends FieldNumber {
	@property() percentSign = '%'

	protected override initialized() {
		super.initialized()
		this.inputElement.min = '0'
		this.inputElement.max = '100'
	}

	protected override fromValue(value: number | undefined): string {
		value = !value ? 0 : value > 100 ? 100 : value < 0 ? 0 : value
		return value ? value.format({ useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '0'
	}

	protected override get template() {
		return html`
			${super.template}
			<div @click=${() => this.focus()} ${style({ fontSize: '20px', fontWeight: '600', color: 'var(--mo-color-gray)' })}>
				${this.percentSign}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-percent': FieldPercent
	}
}