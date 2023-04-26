
import { html, classMap, ClassInfo, component, property } from '@a11d/lit'
import { DateHelper } from '../../../..'
import { CalendarSelectionAdapter } from '../../calendar'
import { FieldDateBase } from './FieldDateBase'

class DateCalendarSelectionAdapter extends CalendarSelectionAdapter<MoDate> {
	getDayTemplate(day: MoDate, classInfo: ClassInfo) {
		return html`
			<mo-flex
				class=${classMap({ ...classInfo, selected: this.calendar.value?.equals(day) ?? false })}
				@click=${() => this.select(day)}
			>${day.dayName}</mo-flex>
		`
	}

	getNavigatingDate(value?: MoDate) {
		const date = value ?? new MoDate()
		return new MoDate(date.year, date.month)
	}
}

/** @element mo-field-date */
@component('mo-field-date')
export class FieldDate extends FieldDateBase<Date | undefined> {
	protected calendarSelectionAdapterConstructor = DateCalendarSelectionAdapter

	@property({ type: Object }) value?: Date

	protected override handleCalendarChange(value?: Date) {
		super.handleCalendarChange(value)
		this.open = false
	}

	protected valueToInputValue(value: Date | undefined) {
		return value ? DateHelper.date(value) ?? '' : ''
	}

	protected toValue(value: string) {
		return value ? DateHelper.parseDateFromText(value, this.shortcutReferenceDate) : undefined
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-date': FieldDate
	}
}