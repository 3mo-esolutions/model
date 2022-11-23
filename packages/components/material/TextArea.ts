import { component, property, event, css } from '@a11d/lit'
import { ComponentMixin } from '../../library'
import { TextArea as MwcTextArea } from '@material/mwc-textarea'
import { MaterialIcon } from '..'

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
	@event() readonly change!: EventDispatcher<string>
	@event() readonly input!: EventDispatcher<string>

	@property() override icon!: MaterialIcon
	@property() override iconTrailing!: MaterialIcon

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mdc-text-field-fill-color: var(--mo-field-background);
					--mdc-text-field-ink-color: var(--mo-color-foreground);
					--mdc-text-field-label-ink-color: var(--mo-color-gray);
					--mdc-text-field-idle-line-color: var(--mo-color-gray);
					--mdc-text-field-hover-line-color: var(--mo-color-gray);
				}

				.mdc-text-field {
					border-start-start-radius: var(--mo-field-border-start-start-radius, 4px);
					border-start-end-radius: var(--mo-field-border-start-end-radius, 4px);
				}
			`
		]
	}

	protected override initialized() {
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