import { component, html, property, style } from '@a11d/lit'
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

	protected override get template() {
		return html`
			${super.template}
			<div @click=${() => this.focus()} ${style({ fontSize: '20px', fontWeight: '600', color: 'var(--mo-color-gray)' })}>
				${this.percentageSign}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-percentage': FieldPercentage
	}
}