import { component, property } from '../../../library'
import { FieldTextBase } from './FieldTextBase'

@component('mo-field-password')
export class FieldPassword extends FieldTextBase {
	@property() override autoComplete: 'current-password' | 'new-password' = 'current-password'
	protected override readonly inputType = 'password'
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-password': FieldPassword
	}
}