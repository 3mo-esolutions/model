import { component, property, ComponentMixin } from '../../library'
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
export class TextArea extends ComponentMixin(MwcTextArea) {
	@eventProperty() readonly change!: IEvent<string>
	@eventProperty() readonly input!: IEvent<string>

	@property() icon!: MaterialIcon
	@property() iconTrailing!: MaterialIcon

	protected initialized() {
		this.formElement.addEventListener('change', (e) => {
			e.stopImmediatePropagation()
			this.change.trigger(this.value)
		})

		this.formElement.addEventListener('input', e => {
			e.stopImmediatePropagation()
			this.input.trigger(this.value)
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-text-area': TextArea
	}
}