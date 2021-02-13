import { component, property, ComponentMixin } from '../../library'
import { MaterialIcon } from '../../types'
import { TextField as MwcTextField } from '@material/mwc-textfield'
import { InputMixin } from './InputMixin'

/**
 * @attr placeholder
 * @attr label
 * @attr disabled
 * @attr required
 * @attr maxLength
 * @attr value
 * @attr type
 * @attr charCounter
 * @attr helper
 * @attr helperPersistent
 */
@component('mo-text-field')
export class TextField extends InputMixin(ComponentMixin(MwcTextField)) {
	@property({ reflect: true }) value!: string
	@property() icon!: MaterialIcon
	@property() trailingIcon!: MaterialIcon
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-text-field': TextField
	}
}