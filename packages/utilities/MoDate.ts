import { LocalizationHelper, Temporal } from '.'

export class MoDate extends Date {
	static readonly isoRegularExpression = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

	static get weekStartDay() {
		// @ts-expect-error weekInfo is not standardized yet and is supported only by Chrome as of 2022-03
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/weekInfo
		return new Intl.Locale(LocalizationHelper.language.value).weekInfo?.firstDay ?? 1
	}

	static getWeekRange([year, weekNumber]: DateWeek) {
		const firstDayOfTheFirstCalendarWeekOfTheYear = new Array(7)
			.fill(undefined)
			.map((_, i) => new MoDate(year, 0, 1).addDay(i))
			.find(d => d.week === 1) as MoDate

		const aDayInTheSpecifiedWeek = firstDayOfTheFirstCalendarWeekOfTheYear.addDay(7 * (weekNumber - 1))
		const weekStart = aDayInTheSpecifiedWeek.addDay(MoDate.weekStartDay - aDayInTheSpecifiedWeek.weekDay)

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

	private _zonedDateTime?: Temporal.ZonedDateTime
	get zonedDateTime() {
		return this._zonedDateTime ??= this.temporalInstant.toZonedDateTime({
			calendar: Intl.DateTimeFormat().resolvedOptions().calendar,
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		})
	}

	equals(comparisonDate: Parameters<Temporal.Instant['equals']>[0] | MoDate) {
		const other = comparisonDate instanceof MoDate ? comparisonDate.temporalInstant : comparisonDate
		return this.temporalInstant.equals(other)
	}

	isBefore(comparisonDate: MoDate) {
		return this.temporalInstant.epochNanoseconds < comparisonDate.temporalInstant.epochNanoseconds
	}

	isAfter(comparisonDate: MoDate) {
		return this.temporalInstant.epochNanoseconds > comparisonDate.temporalInstant.epochNanoseconds
	}

	isInRange([start, end]: DateRange) {
		return !!start && !!end
			&& (this.isAfter(start) || this.equals(start))
			&& (this.isBefore(end) || this.equals(end))
	}

	since(comparisonDate: Parameters<Temporal.Instant['since']>[0] | MoDate = new MoDate) {
		const other = comparisonDate instanceof MoDate ? comparisonDate.temporalInstant : comparisonDate
		const milliseconds = this.temporalInstant.since(other, { largestUnit: 'milliseconds' }).milliseconds
		return new TimeSpan(milliseconds)
	}

	until(comparisonDate: Parameters<Temporal.Instant['until']>[0] | MoDate = new MoDate) {
		const other = comparisonDate instanceof MoDate ? comparisonDate.temporalInstant : comparisonDate
		const milliseconds = this.temporalInstant.until(other, { largestUnit: 'milliseconds' }).milliseconds
		return new TimeSpan(milliseconds)
	}

	add(...parameters: Parameters<Temporal.ZonedDateTime['add']>) {
		return MoDate.fromEpochNanoseconds(this.zonedDateTime.add(...parameters).epochNanoseconds)
	}

	subtract(...parameters: Parameters<Temporal.ZonedDateTime['subtract']>) {
		return MoDate.fromEpochNanoseconds(this.zonedDateTime.subtract(...parameters).epochNanoseconds)
	}

	round(...parameters: Parameters<Temporal.ZonedDateTime['round']>) {
		return MoDate.fromEpochNanoseconds(this.zonedDateTime.round(...parameters).epochNanoseconds)
	}

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
		return this.add({ days })
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

	get weekRange() {
		const weekStart = this.addDay(MoDate.weekStartDay - this.weekDay)
		return new Array(this.zonedDateTime.daysInWeek)
			.fill(undefined)
			.map((_, i) => weekStart.addDay(i))
	}

	get weekStart() {
		return this.weekRange[0]
	}

	get weekEnd() {
		return this.weekRange[this.weekRange.length - 1]
	}

	addWeek(weeks: number) {
		return this.add({ weeks })
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
		return this.monthRange
			.map(date => [date.weekStart.year, date.week] as const)
			.reduce((acc, [year, week]) =>
				acc = acc.some(([y, w]) => y === year && w === week) ? acc : [...acc, [year, week]],
				[] as Array<DateWeek>
			)
	}

	addMonth(months: number) {
		return this.add({ months })
	}
	//#endregion

	//#region Year
	addYear(years: number) {
		return this.add({ years })
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

export class TimeSpan {
	static readonly ticksPerSecond = 1_000
	static readonly ticksPerMinute = TimeSpan.ticksPerSecond * 60
	static readonly ticksPerHour = TimeSpan.ticksPerMinute * 60
	static readonly ticksPerDay = TimeSpan.ticksPerHour * 24
	static readonly ticksPerWeek = TimeSpan.ticksPerDay * 7
	static readonly ticksPerMonths = TimeSpan.ticksPerDay * 30
	static readonly ticksPerYear = TimeSpan.ticksPerDay * 365

	static get zero() { return new TimeSpan(0) }
	static fromMilliseconds(milliseconds: number) { return new TimeSpan(milliseconds) }
	static fromSeconds(seconds: number) { return new TimeSpan(seconds * TimeSpan.ticksPerSecond) }
	static fromMinutes(minutes: number) { return new TimeSpan(minutes * TimeSpan.ticksPerMinute) }
	static fromHours(hours: number) { return new TimeSpan(hours * TimeSpan.ticksPerHour) }
	static fromDays(days: number) { return new TimeSpan(days * TimeSpan.ticksPerDay) }
	static fromWeeks(weeks: number) { return new TimeSpan(weeks * TimeSpan.ticksPerWeek) }
	static fromMonths(months: number) { return new TimeSpan(months * TimeSpan.ticksPerMonths) }
	static fromYears(years: number) { return new TimeSpan(years * TimeSpan.ticksPerYear) }

	constructor(readonly milliseconds: number) { }

	get seconds() { return this.milliseconds / TimeSpan.ticksPerSecond }
	get minutes() { return this.milliseconds / TimeSpan.ticksPerMinute }
	get hours() { return this.milliseconds / TimeSpan.ticksPerHour }
	get days() { return this.milliseconds / TimeSpan.ticksPerDay }
	get weeks() { return this.milliseconds / TimeSpan.ticksPerWeek }
	get months() { return this.milliseconds / TimeSpan.ticksPerMonths }
	get years() { return this.milliseconds / TimeSpan.ticksPerYear }

	valueOf() { return this.milliseconds }

	toString(options: Intl.RelativeTimeFormatOptions = { style: 'long' }) {
		const formatter = new Intl.RelativeTimeFormat(LocalizationHelper.language.value, options)
		const format = (value: number, unit: Intl.RelativeTimeFormatUnit) => formatter.format(Math.sign(value) * Math.floor(Math.abs(value)), unit)
		switch (true) {
			case Math.abs(this.years) >= 1:
				return format(this.years, 'years')
			case Math.abs(this.months) >= 1:
				return format(this.months, 'months')
			case Math.abs(this.weeks) >= 1:
				return format(this.weeks, 'weeks')
			case Math.abs(this.days) >= 1:
				return format(this.days, 'days')
			case Math.abs(this.hours) >= 1:
				return format(this.hours, 'hours')
			case Math.abs(this.minutes) >= 1:
				return format(this.minutes, 'minutes')
			default:
				return format(this.seconds, 'seconds')
		}
	}
}

globalThis.MoDate = MoDate
globalThis.TimeSpan = TimeSpan

type MoDateClass = typeof MoDate
type TimeSpanClass = typeof TimeSpan

declare global {
	// eslint-disable-next-line
	var MoDate: MoDateClass
	type MoDate = InstanceType<MoDateClass>
	// eslint-disable-next-line
	var TimeSpan: TimeSpanClass
	type TimeSpan = InstanceType<TimeSpanClass>
}