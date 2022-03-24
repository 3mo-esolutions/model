
import { component, property } from '../../../../library'
import { FormatHelper, DateHelper, ClassInfo, classMap, css, html } from '../../../..'
import { FieldDateBase } from './FieldDateBase'
import { MaterialIcon } from '../../../helpers'
import { CalendarSelectionAdapter } from '../../calendar'

class DateRangeCalendarSelectionAdapter extends CalendarSelectionAdapter<DateRange> {
	override get styles() {
		return css`
			.day.selected.first {
				border-radius: 100px 0 0 100px;
			}

			.day.selected.last {
				border-radius: 0 100px 100px 0;
			}

			.day.inDateRange:not(.selected) {
				background: var(--mo-accent-transparent);
			}

			.day.inDateRange {
				border-radius: 0px;
			}
		`
	}

	getDayTemplate(day: MoDate, classInfo: ClassInfo) {
		const [startDate, endDate] = this.calendar.value ?? [undefined, undefined]
		const classes = {
			...classInfo,
			inDateRange: !this.calendar.value ? false : day.isInRange(this.calendar.value),
			selected: this.calendar.value?.some(d => d?.equals(day)) ?? false,
			first: !startDate ? false : day.equals(startDate),
			last: !endDate ? false : day.equals(endDate),
		}
		return html`
			<mo-flex
				class=${classMap(classes)}
				@click=${() => this.handleClick(day)}
			>${day.day}</mo-flex>
		`
	}

	getNavigatingDate(value?: DateRange) {
		const date = value?.[0] ?? new MoDate()
		return new MoDate(date.year, date.month)
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	private isSelectingEndDate = false

	private handleClick(date: MoDate) {
		const [startDate, endDate] = this.calendar.value ?? [undefined, undefined]
		const value = ((this.isSelectingEndDate ? [startDate, date] : [date, endDate]) as DateRange)
			.sort((a, b) => (a?.valueOf() ?? 0) - (b?.valueOf() ?? 0))
		this.isSelectingEndDate = !!value[0]
		this.select(value)
	}
}

@component('mo-field-date-range')
export class FieldDateRange extends FieldDateBase<DateRange | undefined> {
	protected calendarSelectionAdapterConstructor = DateRangeCalendarSelectionAdapter
	// For lit-analyzer to solve generic error
	@property({ type: Array })
	override get value() { return super.value || [undefined, undefined] }
	override set value(value) { super.value = value }

	protected override calendarIconButtonIcon: MaterialIcon = 'date_range'

	protected override handleCalendarChange(value?: DateRange) {
		super.handleCalendarChange(value)
		if (this.value[0] && this.value[1]) {
			this.open = false
		}
	}

	protected fromValue(value: DateRange | undefined) {
		return value ? FormatHelper.dateRange(value) ?? '' : ''
	}

	protected toValue(value: string) {
		return value ? DateHelper.parseDateRangeFromText(value, this.shortcutReferenceDate) : undefined
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-date-range': FieldDateRange
	}
}