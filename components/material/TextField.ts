import { component, property, componentize, InputElement } from '../../library'
import { MaterialIcon } from '../../types'
import { TextField as MwcTextField } from '@material/mwc-textfield'

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
@component('mdc-text-field')
export default class TextField extends componentize(MwcTextField) implements InputElement<string> {
	@property() icon!: MaterialIcon
	@property() trailingIcon!: MaterialIcon
}