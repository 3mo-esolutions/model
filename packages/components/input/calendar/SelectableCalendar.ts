import { component, property, event, html } from '../../..'
import { CalendarSelectionAdapter, Calendar } from '.'

/** @fires change {CustomEvent<T>} */
@component('mo-selectable-calendar')
export class SelectableCalendar<T> extends Calendar {
	@event() readonly change!: EventDispatcher<T>

	@property({ type: Object }) selectionAdapterConstructor!: Constructor<CalendarSelectionAdapter<T>>
	@property({
		type: Object, updated(this: SelectableCalendar<T>) {
			this.navigatingDate = this.selectionAdapter.getNavigatingDate(this.value)
		}
	}) value?: T

	private _selectionAdapter?: CalendarSelectionAdapter<T>
	get selectionAdapter() { return this._selectionAdapter ??= new this.selectionAdapterConstructor(this) }

	protected override get template() {
		return html`
			<style>
				${this.selectionAdapter.styles}
			</style>
			${super.template}
		`
	}

	protected override getDayTemplate(day: MoDate) {
		return this.selectionAdapter.getDayTemplate(day, this.getDefaultDayElementClasses(day))
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-selectable-calendar': SelectableCalendar<unknown>
	}
}