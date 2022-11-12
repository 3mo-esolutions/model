import { component } from '@a11d/lit'
import { TextArea } from '../..'

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
@component('mo-field-text-area')
export class FieldTextArea extends TextArea { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-text-area': FieldTextArea
	}
}