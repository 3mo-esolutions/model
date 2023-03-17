import { component, property } from '@a11d/lit'
import { Field } from '../Field'

@component('mo-field-number')
export class FieldNumber extends Field<number> {
	override readonly inputMode = 'decimal'
	override readonly autoComplete = 'off'
	override readonly selectOnFocus = true

	// For lit-analyzer to solve generic error
	@property({ type: Number, reflect: true })
	override get value(): number | undefined { return super.value }
	override set value(value: number | undefined) { super.value = value }

	@property({ type: Number, reflect: true }) override min?: number
	@property({ type: Number, reflect: true }) override max?: number
	@property({ type: Number, reflect: true }) override step?: number

	protected fromValue(value: number | undefined): string {
		return typeof value === 'number' ? this.inRange(value).format() : ''
	}

	protected toValue(value: string): number | undefined {
		const v = value.toNumber()
		return v === undefined ? undefined : this.inRange(v)
	}

	private inRange(value: number) {
		return Math.min(Math.max(value, this.min ?? -Infinity), this.max ?? Infinity)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-number': FieldNumber
	}
}