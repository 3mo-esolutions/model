import { component, property, ComponentMixin, event } from '../../library'
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
	@event() readonly change!: IEvent<string>
	@event() readonly input!: IEvent<string>

	@property() icon!: MaterialIcon
	@property() iconTrailing!: MaterialIcon

	protected initialized() {
		this.formElement.addEventListener('change', (e) => {
			e.stopImmediatePropagation()
			this.change.dispatch(this.value)
		})

		this.formElement.addEventListener('input', e => {
			e.stopImmediatePropagation()
			this.input.dispatch(this.value)
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-text-area': TextArea
	}
}