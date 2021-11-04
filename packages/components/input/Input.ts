import { Component, property, query, event } from '../../library'

/**
 * @fires change {CustomEvent<T | undefined>}
 */
export abstract class Input<T> extends Component {
	@event() readonly change!: EventDispatcher<T | undefined>

	@query('input') protected readonly inputElement!: HTMLInputElement

	protected _value: T | undefined
	@property()
	get value(): T | undefined { return this.toValue(this.inputElement?.value || '') ?? this._value }
	set value(value: T | undefined) {
		this._value = value
		this.updateComplete.then(() => this.inputElement.value = this.fromValue(value))
	}

	protected abstract fromValue(value: T | undefined): string
	protected abstract toValue(value: string): T | undefined

	protected override firstUpdated() {
		this.inputElement.addEventListener('change', () => this.handleChange())
	}

	protected handleChange() {
		this.value = this.toValue(this.inputElement.value)
		this.change.dispatch(this.value)
	}
}