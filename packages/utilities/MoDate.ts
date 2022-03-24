import { LocalizationHelper, Temporal } from '.'

export class MoDate extends Date {
	static readonly isoRegularExpression = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

	static formatDuration = formatDuration

	static get weekStartDay() {
		// @ts-expect-error weekInfo is not standardized yet and is supported only by Chrome as of 2022-03
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/weekInfo
		return new Intl.Locale(LocalizationHelper.language.value).weekInfo?.firstDay ?? 1
	}

	static getWeekRange(weekNumber: number, year: number) {
		const firstDayOfTheFirstCalendarWeekOfTheYear = new Array(7)
			.fill(undefined)
			.map((_, i) => new MoDate(year, 0, 1).addDay(i))
			.find(d => d.week === 1) as MoDate

		const aDayInTheSpecifiedWeek = firstDayOfTheFirstCalendarWeekOfTheYear.addDay(7 * (weekNumber - 1))
		const weekStart = new MoDate(aDayInTheSpecifiedWeek.addDay(MoDate.weekStartDay - aDayInTheSpecifiedWeek.weekDay))

		return new Array(7)
			.fill(undefined)
			.map((_, i) => weekStart.addDay(i))
	}

	static fromEpochNanoseconds(epochNanoseconds: bigint) {
		return new MoDate(Number(epochNanoseconds / BigInt(1_000_000)))
	}

	private _temporalInstant?: Temporal.Instant
	get temporalInstant() {
		return this._temporalInstant ??= new Temporal.Instant(BigInt(this.valueOf() * 1_000_000))
	}

	//#region Instant
	equals(comparisonDate: Parameters<Temporal.Instant['equals']>[0] | MoDate) {
		const other = comparisonDate instanceof MoDate ? comparisonDate.temporalInstant : comparisonDate
		return this.temporalInstant.equals(other)
	}

	since(
		comparisonDate: Parameters<Temporal.Instant['since']>[0] | MoDate = new MoDate,
		options?: Parameters<Temporal.Instant['since']>[1],
	) {
		const other = comparisonDate instanceof MoDate ? comparisonDate.temporalInstant : comparisonDate
		return this.temporalInstant.since(other, options)
	}

	until(
		comparisonDate: Parameters<Temporal.Instant['until']>[0] | MoDate = new MoDate,
		options?: Parameters<Temporal.Instant['until']>[1],
	) {
		const other = comparisonDate instanceof MoDate ? comparisonDate.temporalInstant : comparisonDate
		return this.temporalInstant.since(other, options)
	}

	add(...parameters: Parameters<Temporal.Instant['add']>) {
		return this.temporalInstant.add(...parameters)
	}

	subtract(...parameters: Parameters<Temporal.Instant['subtract']>) {
		return this.temporalInstant.subtract(...parameters)
	}

	round(...parameters: Parameters<Temporal.Instant['round']>) {
		return this.temporalInstant.round(...parameters)
	}

	toZonedDateTime(...parameters: Parameters<Temporal.Instant['toZonedDateTime']>) {
		return this.temporalInstant.toZonedDateTime(...parameters)
	}

	get zonedDateTime() {
		const dateTimeResolvedOptions = Intl.DateTimeFormat().resolvedOptions()
		return this.toZonedDateTime({
			calendar: dateTimeResolvedOptions.calendar,
			timeZone: dateTimeResolvedOptions.timeZone,
		})
	}

	toZonedDateTimeISO(...parameters: Parameters<Temporal.Instant['toZonedDateTimeISO']>) {
		return this.temporalInstant.toZonedDateTimeISO(...parameters)
	}
	//#endregion

	//#region Day
	static get weekDayNames() {
		return new Array(7)
			.fill(undefined)
			.map((_, i) => new Date(1970, 0, i - 2).toLocaleString(LocalizationHelper.language.value, { weekday: 'long' }))
	}

	get day() {
		return this.getDate()
	}

	addDay(days: number) {
		return MoDate.fromEpochNanoseconds(this.zonedDateTime.add({ days }).epochNanoseconds)
	}

	get weekDay() {
		return this.zonedDateTime.dayOfWeek
	}

	get weekDayName() {
		return MoDate.weekDayNames[this.weekDay]
	}
	//#endregion

	//#region Week
	get week() {
		return this.zonedDateTime.weekOfYear
	}

	get weekStart() {
		return this.weekRange[0]
	}

	get weekEnd() {
		const range = MoDate.getWeekRange(this.week, this.year)
		return range[range.length - 1]
	}

	get weekRange() {
		return MoDate.getWeekRange(this.week, this.year)
	}

	addWeek(weeks: number) {
		return MoDate.fromEpochNanoseconds(this.zonedDateTime.add({ weeks }).epochNanoseconds)
	}
	//#endregion

	//#region Month
	static get monthNames() {
		const format = new Intl.DateTimeFormat(LocalizationHelper.language.value, { month: 'long' })
		return new Array(12)
			.fill(undefined)
			.map((_, i) => format.format(new Date(Date.UTC(2000, i, 1, 0, 0, 0))))
	}

	get month() {
		return this.getMonth()
	}

	get monthName() {
		return MoDate.monthNames[this.month]
	}

	get monthStart() {
		return new MoDate(this.year, this.month, 1)
	}

	get monthEnd() {
		return new MoDate(this.year, this.month + 1, 0)
	}

	get monthRange() {
		return new Array(this.monthEnd.day - this.monthStart.day + 1)
			.fill(undefined)
			.map((_, i) => new MoDate(this.year, this.month, i + 1))
	}

	get monthWeeks() {
		return [...new Set(this.monthRange.map(date => date.week))]
	}

	addMonth(months: number) {
		return MoDate.fromEpochNanoseconds(this.zonedDateTime.add({ months }).epochNanoseconds)
	}
	//#endregion

	//#region Year
	addYear(years: number) {
		return MoDate.fromEpochNanoseconds(this.zonedDateTime.add({ years }).epochNanoseconds)
	}

	get year() {
		return this.getFullYear()
	}

	get yearStart() {
		return new MoDate(this.year, 0, 1)
	}

	get yearEnd() {
		return new MoDate(this.year + 1, 0, 1).addDay(-1)
	}
	//#endregion
}

export function formatDuration(duration: Temporal.Duration) {
	const formatter = new Intl.RelativeTimeFormat(LocalizationHelper.language.value, { style: 'long' })
	switch (true) {
		case Math.abs(duration.years) >= 1:
			return formatter.format(Math.floor(duration.years), 'years')
		case Math.abs(duration.months) >= 1:
			return formatter.format(Math.floor(duration.months), 'months')
		case Math.abs(duration.weeks) >= 1:
			return formatter.format(Math.floor(duration.weeks), 'weeks')
		case Math.abs(duration.days) >= 1:
			return formatter.format(Math.floor(duration.days), 'days')
		case Math.abs(duration.hours) >= 1:
			return formatter.format(Math.floor(duration.hours), 'hours')
		case Math.abs(duration.minutes) >= 1:
			return formatter.format(Math.floor(duration.minutes), 'minutes')
		default:
			return formatter.format(Math.floor(duration.seconds), 'seconds')
	}
}

globalThis.formatDuration = formatDuration
globalThis.MoDate = MoDate

type MoDateClass = typeof MoDate
type FormatDurationFunction = typeof formatDuration

declare global {
	// eslint-disable-next-line
	var formatDuration: FormatDurationFunction
	// eslint-disable-next-line
	var MoDate: MoDateClass
	type MoDate = InstanceType<MoDateClass>
}