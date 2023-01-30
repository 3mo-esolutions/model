
import { ClassInfo, component, property } from '@a11d/lit'
import { FormatHelper, DateHelper, html, classMap } from '../../../..'
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

	// For lit-analyzer to solve generic error
	@property({ type: Object })
	override get value() { return super.value }
	override set value(value) { super.value = value }

	protected override handleCalendarChange(value?: Date) {
		super.handleCalendarChange(value)
		this.open = false
	}

	protected fromValue(value: Date | undefined) {
		return value ? FormatHelper.date(value) ?? '' : ''
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