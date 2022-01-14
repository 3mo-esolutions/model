
import { component, property } from '../../../../library'
import { FormatHelper, DateHelper, state } from '../../../..'
import { FieldDateBase } from './FieldDateBase'

@component('mo-field-date-range')
export class FieldDateRange extends FieldDateBase<DateRange | undefined> {
	// For lit-analyzer to solve generic error
	@property({ type: Array })
	override get value() { return super.value || [undefined, undefined] }
	override set value(value) { super.value = value }

	@state() isSelectingEndDate = true

	protected override get calendarDate() { return new MoDate(this.value[0] || new Date) }
	protected override set calendarDate(date) {
		const [startDate, endDate] = this.value
		const value: DateRange = this.isSelectingEndDate ? [startDate, date] : [date, endDate]
		this.value = value
		this.change.dispatch(value)
		if (value[0] && value[1]) {
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