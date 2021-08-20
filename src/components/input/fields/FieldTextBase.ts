import { property, event } from '../../../library'
import { Field } from '../Field'

/**
 * @fires input {CustomEvent<string>}
 */
export abstract class FieldTextBase extends Field<string> {
	@event() readonly input!: EventDispatcher<string>

	@property({ reflect: true })
	override get value(): string | undefined { return super.value }
	override set value(value: string | undefined) { super.value = value }


	protected fromValue(value: string | undefined): string {
		return value ?? ''
	}

	protected toValue(value: string | undefined): string {
		return value ?? ''
	}

	protected override initialized() {
		super.initialized()
		this.registerInputEventListener()
	}

	protected registerInputEventListener() {
		this.inputElement.addEventListener('input', (e: Event) => {
			e.stopPropagation()
			this.input.dispatch(this.toValue(this.inputElement.value))
		})
	}
}