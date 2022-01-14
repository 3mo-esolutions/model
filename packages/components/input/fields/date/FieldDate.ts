
import { component, property } from '../../../../library'
import { FormatHelper, DateHelper } from '../../../..'
import { FieldDateBase } from './FieldDateBase'

@component('mo-field-date')
export class FieldDate extends FieldDateBase<Date | undefined> {
	// For lit-analyzer to solve generic error
	@property({ type: Object })
	override get value() { return super.value }
	override set value(value) { super.value = value }

	protected override get calendarDate() { return new MoDate(this.value || new Date) }
	protected override set calendarDate(value) {
		this.open = false
		this.value = value
		this.change.dispatch(value)
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