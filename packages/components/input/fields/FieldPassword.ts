import { component } from '../../../library'
import { FieldTextBase } from './FieldTextBase'

@component('mo-field-password')
export class FieldPassword extends FieldTextBase {
	protected override firstUpdated() {
		super.firstUpdated()
		this.inputElement.type = 'password'
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-password': FieldPassword
	}
}