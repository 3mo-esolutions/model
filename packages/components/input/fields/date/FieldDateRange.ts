
import { component, property } from '../../../../library'
import { FormatHelper, DateHelper, ClassInfo, classMap, css, html, state, style } from '../../../..'
import { FieldDateBase } from './FieldDateBase'
import { MaterialIcon } from '../../../helpers'
import { CalendarSelectionAdapter } from '../../calendar'

const enum DateRangeCalendarSelectionAdapterCurrentSelection { StartDate, EndDate }

class DateRangeCalendarSelectionAdapter extends CalendarSelectionAdapter<DateRange> {
	currentSelection = DateRangeCalendarSelectionAdapterCurrentSelection.StartDate

	override get styles() {
		return css`
			.day.selected.first {
				border-radius: 100px 0 0 100px;
			}

			.day.selected.last {
				border-radius: 0 100px 100px 0;
			}

			.day.selected.first.last {
				border-radius: 100px;
			}

			.day.inDateRange:not(.selected) {
				background: var(--mo-color-accent-transparent);
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

	private handleClick(date: MoDate) {
		const [startDate, endDate] = this.calendar.value ?? [undefined, undefined]

		const shallReset = !!startDate && !!endDate
		const value = this.currentSelection === DateRangeCalendarSelectionAdapterCurrentSelection.StartDate
			? [date, shallReset ? undefined : endDate]
			: [shallReset ? undefined : startDate, date]

		const [newStartDate, newEndDate] = value

		if (newStartDate && newEndDate) {
			(value as [MoDate, MoDate]).sort((a, b) => a.valueOf() - b.valueOf())
		}

		this.currentSelection = newStartDate
			? DateRangeCalendarSelectionAdapterCurrentSelection.EndDate
			: DateRangeCalendarSelectionAdapterCurrentSelection.StartDate

		this.select(value as DateRange)
	}
}

@component('mo-field-date-range')
export class FieldDateRange extends FieldDateBase<DateRange | undefined> {
	@state()
	private get currentSelection() { return (this.calendarElement?.selectionAdapter as DateRangeCalendarSelectionAdapter | undefined)?.currentSelection ?? DateRangeCalendarSelectionAdapterCurrentSelection.StartDate }
	private set currentSelection(value) {
		const selectionAdapter = (this.calendarElement?.selectionAdapter as DateRangeCalendarSelectionAdapter | undefined)
		if (selectionAdapter) {
			selectionAdapter.currentSelection = value
			this.requestUpdate()
		}
	}

	protected calendarSelectionAdapterConstructor = DateRangeCalendarSelectionAdapter

	// For lit-analyzer to solve generic error
	@property({ type: Array })
	override get value() { return super.value || [undefined, undefined] }
	override set value(value) { super.value = value }

	protected override calendarIconButtonIcon: MaterialIcon = 'date_range'

	protected override handleCalendarChange(value?: DateRange) {
		super.handleCalendarChange(value)
		const [startDate, endDate] = value ?? [undefined, undefined]
		if (startDate && endDate) {
			this.open = false
		}
	}

	protected override get menuContentTemplate() {
		const [startDate, endDate] = this.value
		return html`
			<mo-flex>
				<mo-flex direction='horizontal' alignItems='center' ${style({ textAlign: 'center', height: '30px' })}>
						<mo-div ${style({ width: '*', fontWeight: '500', cursor: 'pointer' })}
							${style({ color: this.currentSelection === DateRangeCalendarSelectionAdapterCurrentSelection.StartDate ? 'var(--mo-color-accent)' : 'unset' })}
							@click=${() => this.currentSelection = DateRangeCalendarSelectionAdapterCurrentSelection.StartDate}
						>${!startDate ? 'Start' : FormatHelper.date(startDate)}</mo-div>

						<mo-div ${style({ color: 'var(--mo-color-gray)' })}>bis</mo-div>

						<mo-div ${style({ width: '*', fontWeight: '500', cursor: 'pointer' })}
							${style({ color: this.currentSelection === DateRangeCalendarSelectionAdapterCurrentSelection.EndDate ? 'var(--mo-color-accent)' : 'unset' })}
							@click=${() => this.currentSelection = DateRangeCalendarSelectionAdapterCurrentSelection.EndDate}
						>${!endDate ? 'Ende' : FormatHelper.date(endDate)}</mo-div>
				</mo-flex>
				${super.menuContentTemplate}
			</mo-flex>
		`
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