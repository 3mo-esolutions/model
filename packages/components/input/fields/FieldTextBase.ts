import { property } from '../../../library'
import { Field } from '../Field'

export abstract class FieldTextBase extends Field<string> {
	@property({ reflect: true })
	override get value(): string | undefined { return super.value }
	override set value(value: string | undefined) { super.value = value }

	protected fromValue(value: string | undefined): string {
		return value ?? ''
	}

	protected toValue(value: string | undefined): string {
		return value ?? ''
	}
}