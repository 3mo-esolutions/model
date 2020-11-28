import { component, property, componentize, InputElement } from '../../library'
import { TextArea as MwcTextArea } from '@material/mwc-textarea'
import { MaterialIcon } from '../../types'

/**
 * @attr placeholder
 * @attr label
 * @attr disabled
 * @attr required
 * @attr maxLength
 * @attr rows
 * @attr cols
 * @attr value
 * @attr type
 * @attr charCounter
 * @attr helper
 * @attr helperPersistent
 */
@component('mo-text-area')
export default class TextArea extends componentize(MwcTextArea) implements InputElement<string> {
	@property() icon!: MaterialIcon
	@property() iconTrailing!: MaterialIcon
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-text-area': TextArea
	}
}