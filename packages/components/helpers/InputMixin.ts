import { PropertyValues, query, event } from '../../library'
import { LitElement } from 'lit-element'
import '@material/mwc-formfield'

export const InputMixin = <T extends Constructor<LitElement>, TValue>(Constructor: T) => {
	abstract class InputMixinConstructor extends Constructor {
		@event() readonly change!: IEvent<TValue>

		abstract get value(): TValue
		abstract set value(value: TValue)

		@query('input') private readonly inputElement!: HTMLElement

		protected override firstUpdated(changedProperties: PropertyValues) {
			super.firstUpdated(changedProperties)
			this.inputElement.addEventListener('change', (e) => {
				e.stopImmediatePropagation()
				this.change.dispatch(this.value)
			})
		}
	}
	return InputMixinConstructor
}