import { ClassInfo, css, HTMLTemplateResult } from '@a11d/lit'
import { SelectableCalendar } from './SelectableCalendar'

export abstract class CalendarSelectionAdapter<T> {
	constructor(protected readonly calendar: SelectableCalendar<T>) { }

	get styles() { return css`` }

	abstract getDayTemplate(day: MoDate, classInfo: ClassInfo): HTMLTemplateResult

	abstract getNavigatingDate(value: T | undefined): MoDate

	protected select(value: T) {
		this.calendar.value = value
		this.calendar.change.dispatch(value)
	}
}