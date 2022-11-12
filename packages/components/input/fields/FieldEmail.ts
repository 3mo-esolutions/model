import { component } from '@a11d/lit'
import { FieldTextBase } from './FieldTextBase'

@component('mo-field-email')
export class FieldEmail extends FieldTextBase {
	override readonly inputMode = 'email'
	protected override readonly inputType = 'email'
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-email': FieldEmail
	}
}