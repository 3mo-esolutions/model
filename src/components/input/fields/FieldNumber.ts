import { component, property } from '../../../library'
import { FormatHelper } from '../../../helpers'
import { Field } from '../Field'

@component('mo-field-number')
export class FieldNumber extends Field<number> {
	// For lit-analyzer to solve generic error
	@property({ type: Number, reflect: true })
	override get value(): number | undefined { return super.value }
	override set value(value: number | undefined) { super.value = value }

	protected fromValue(value: number | undefined): string {
		return typeof value === 'number' ? FormatHelper.number(value) : ''
	}

	protected toValue(value: string): number | undefined {
		return FormatHelper.localNumberToNumber(value)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-number': FieldNumber
	}
}