import { property } from '../../../library'
import { Field } from '../Field'

/**
 * @fires input
 */
export abstract class FieldTextBase extends Field<string> {
	@eventProperty() readonly input!: IEvent<string>

	@property({ reflect: true })
	get value(): string | undefined { return super.value }
	set value(value: string | undefined) { super.value = value }


	protected fromValue(value: string | undefined): string {
		return value ?? ''
	}

	protected toValue(value: string | undefined): string {
		return value ?? ''
	}

	protected initialized() {
		super.initialized()
		this.registerInputEventListener()
	}

	protected registerInputEventListener() {
		this.inputElement.addEventListener('input', (e: Event) => {
			e.stopPropagation()
			this.input.trigger(this.toValue(this.inputElement.value))
		})
	}
}