import { Localizer, Temporal } from '..'

export class MoDate extends Date {
	static readonly isoRegularExpression = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/

	static get weekStartDay(): number {
		// @ts-expect-error weekInfo is not standardized yet and is supported only by Chrome as of 2022-03
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/weekInfo
		return new Intl.Locale(Localizer.currentLanguage).weekInfo?.firstDay ?? 1
	}

	static rangeOf(startDate: MoDate, endDate: MoDate) {
		return new Array(Math.abs(Math.round(endDate.until(startDate).days)) + 1)
			.fill(undefined)
			.map((_, i) => startDate.addDay(i))
	}

	static fromEpochNanoseconds(epochNanoseconds: bigint) {
		return new MoDate(Number(epochNanoseconds / BigInt(1_000_000)))
	}

	private _temporalInstant?: Temporal.Temporal.Instant
	get temporalInstant() {
		return this._temporalInstant ??= new Temporal.Temporal.Instant(BigInt(this.valueOf() * 1_000_000))
	}

	private _zonedDateTime?: Temporal.Temporal.ZonedDateTime
	get zonedDateTime() {
		return this._zonedDateTime ??= this.temporalInstant.toZonedDateTime({
			calendar: Intl.DateTimeFormat().resolvedOptions().calendar,
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		})
	}

	equals(comparisonDate: Parameters<Temporal.Temporal.Instant['equals']>[0] | MoDate) {
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

	since(comparisonDate: Parameters<Temporal.Temporal.Instant['since']>[0] | MoDate = new MoDate) {
		const other = comparisonDate instanceof MoDate ? comparisonDate.temporalInstant : comparisonDate
		const milliseconds = this.temporalInstant.since(other, { largestUnit: 'milliseconds' }).milliseconds
		return new TimeSpan(milliseconds)
	}

	until(comparisonDate: Parameters<Temporal.Temporal.Instant['until']>[0] | MoDate = new MoDate) {
		const other = comparisonDate instanceof MoDate ? comparisonDate.temporalInstant : comparisonDate
		const milliseconds = this.temporalInstant.until(other, { largestUnit: 'milliseconds' }).milliseconds
		return new TimeSpan(milliseconds)
	}

	add(...parameters: Parameters<Temporal.Temporal.ZonedDateTime['add']>) {
		return MoDate.fromEpochNanoseconds(this.zonedDateTime.add(...parameters).epochNanoseconds)
	}

	subtract(...parameters: Parameters<Temporal.Temporal.ZonedDateTime['subtract']>) {
		return MoDate.fromEpochNanoseconds(this.zonedDateTime.subtract(...parameters).epochNanoseconds)
	}

	round(...parameters: Parameters<Temporal.Temporal.ZonedDateTime['round']>) {
		return MoDate.fromEpochNanoseconds(this.zonedDateTime.round(...parameters).epochNanoseconds)
	}

	//#region Day
	static get weekDayNames() {
		return new MoDate().weekRange.map(d => d.toLocaleString(Localizer.currentLanguage, { weekday: 'long' }))
	}

	get day() {
		return this.getDate()
	}

	get dayName() {
		return new Intl.DateTimeFormat(Localizer.currentLanguage, { day: 'numeric' }).format(this)
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
		const weekStart = this.addDay(-Math.abs(MoDate.weekStartDay - this.weekDay))
		const weekEnd = weekStart.addDay(this.zonedDateTime.daysInWeek - 1)
		return MoDate.rangeOf(weekStart, weekEnd)
	}

	get weekStart() {
		return this.weekRange[0]!
	}

	get weekEnd() {
		return this.weekRange[this.weekRange.length - 1]!
	}

	addWeek(weeks: number) {
		return this.add({ weeks })
	}
	//#endregion

	//#region Month
	static get monthNames() {
		const format = new Intl.DateTimeFormat(Localizer.currentLanguage, { month: 'long' })
		return new Array(12)
			.fill(undefined)
			.map((_, i) => format.format(new Date(Date.UTC(2000, i, 1, 0, 0, 0))))
	}

	get month() {
		return this.getMonth()
	}

	get localMonth() {
		return Number(new Intl.DateTimeFormat(Localizer.currentLanguage, { month: 'numeric', numberingSystem: 'latn' }).format(this))
	}

	get monthName() {
		return MoDate.monthNames[this.month]
	}

	get monthRange() {
		const start = new MoDate(this.year, this.month, 1)
		const dayDifference = Number(new Intl.DateTimeFormat(Localizer.currentLanguage, { day: 'numeric', numberingSystem: 'latn' }).format(start)) - 1
		const startDay = start.addDay(-dayDifference)
		const endDay = startDay.addMonth(1).addDay(-1)
		return MoDate.rangeOf(startDay, endDay)
	}

	get monthStart() {
		return this.monthRange[0]!
	}

	get monthEnd() {
		return this.monthRange[this.monthRange.length - 1]!
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

	get yearNames() {
		const formatter = new Intl.DateTimeFormat(Localizer.currentLanguage, { year: 'numeric', numberingSystem: 'latn' })
		return new Array(12)
			.fill(undefined)
			.map((_, i) => formatter.format(new Date(Date.UTC(this.year, i, 1, 0, 0, 0))))
	}

	get yearName() {
		return this.yearNames[this.month]
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
		const formatter = new Intl.RelativeTimeFormat(Localizer.currentLanguage, options)
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