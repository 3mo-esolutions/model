import { Component, property, query } from '../../library'

/**
 * @fires change
 * @fires input
 */
export abstract class Input<T> extends Component {
	@eventProperty() readonly change!: IEvent<T | undefined>
	@query('input') protected readonly inputElement!: HTMLInputElement

	protected _value: T | undefined
	@property()
	get value(): T | undefined { return this.toValue(this.inputElement?.value ?? '') ?? this._value }
	set value(value: T | undefined) {
		this._value = value
		this.updateComplete.then(() => this.inputElement.value = this.fromValue(value))
	}

	protected initialized() {
		this.inputElement.addEventListener<any>('change', (e: CustomEvent<undefined, HTMLInputElement>) => {
			this.change.trigger(this.toValue(e.source.value))
			this.value = this.value
		})
	}

	protected abstract fromValue(value: T | undefined): string
	protected abstract toValue(value: string): T | undefined
}