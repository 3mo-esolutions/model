import { LocalizationHelper } from '.'

// eslint-disable-next-line no-restricted-syntax
enum Month {
	January,
	February,
	March,
	April,
	May,
	June,
	July,
	August,
	September,
	October,
	November,
	December,
}

// eslint-disable-next-line no-restricted-syntax
enum WeekDay {
	Sunday,
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
}

type WeekStartDay = Extract<WeekDay, WeekDay.Sunday | WeekDay.Monday>

export class MoDate extends Date {
	static readonly isoRegularExpression = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
	private readonly weekStartDay: WeekStartDay = WeekDay.Monday

	difference(comparisonDate = new MoDate) {
		return new TimeSpan(this, comparisonDate)
	}

	//#region Day
	static get weekDayNames() {
		const daysNumbers = new Array(7).fill(undefined).map((_, i) => 5 + i)
		return daysNumbers.map(number => new Date(1970, 1 - 1, number).toLocaleString('de', { weekday: 'long' }))
	}

	get day() {
		return this.getDate()
	}

	addDay(days: number) {
		const date = new MoDate(this)
		date.setDate(this.day + days)
		return date
	}

	get weekDay() {
		return this.getDay() as WeekDay
	}

	get weekDayCorrected() {
		return this.weekStartDay === WeekDay.Sunday
			? this.weekDay
			: (this.weekDay + 6) % 7
	}

	get weekDayName() {
		return MoDate.weekDayNames[this.weekDay]
	}
	//#endregion

	//#region Week
	get week() {
		const target = new MoDate(this.valueOf())
		const dayNr = (this.weekDay + 6) % 7
		target.setDate(target.day - dayNr + 3)
		const firstThursday = target.valueOf()
		target.setMonth(0, 1)
		if (target.weekDay !== 4) {
			target.setMonth(0, 1 + ((4 - target.weekDay) + 7) % 7)
		}
		return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
	}

	get weekStart() {
		return this.getWeekRange(this.week)[0]
	}

	get weekEnd() {
		return this.getWeekRange(this.week)[this.getWeekRange(this.week).length - 1]
	}

	getWeekStart(weekNumber: number) {
		return this.getWeekRange(weekNumber)[0]
	}

	getWeekEnd(weekNumber: number) {
		return this.getWeekRange(weekNumber)[this.getWeekRange(weekNumber).length - 1]
	}

	getWeekRange(weekNumber = this.week, year = this.year) {
		const aDayInTheSpecifiedWeek = new MoDate(year, Month.January, 1).addDay(7 * (weekNumber - 1))

		const diff = aDayInTheSpecifiedWeek.day - aDayInTheSpecifiedWeek.weekDay + (this.weekStartDay === WeekDay.Sunday ? -6 : 1)
		const weekStart = new MoDate(aDayInTheSpecifiedWeek.setDate(diff))

		const range = []
		for (let i = 0; i < 7; i++) {
			range.push(weekStart.addDay(i))
		}

		return range
	}
	//#endregion

	//#region Month
	static get monthNames() {
		const format = new Intl.DateTimeFormat(LocalizationHelper.language.value, { month: 'long' })
		const monthNumbers = new Array(12).fill(undefined).map((_, i) => i)
		return monthNumbers.map(number => format.format(new Date(Date.UTC(2000, number, 1, 0, 0, 0))))
	}

	get month() {
		return this.getMonth() as Month
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
		const range = new Array<MoDate>()
		for (let day = this.monthStart.day; day <= this.monthEnd.day; day++) {
			range.push(new MoDate(this.year, this.month, day))
		}
		return range
	}

	get monthWeeks() {
		const weekNumbers = this.monthRange.map(date => date.week)
		return weekNumbers.filter((week, index) => weekNumbers.indexOf(week) === index).sort()
	}

	addMonth(months: number) {
		const date = new MoDate(this)
		date.setMonth(this.month + months)
		return date
	}
	//#endregion

	//#region Year
	addYear(years: number) {
		const date = new MoDate(this)
		date.setFullYear(this.year + years)
		return date
	}

	get year() {
		return this.getFullYear()
	}

	get yearStart() {
		return new MoDate(this.year, 0, 1)
	}

	get yearEnd() {
		return new MoDate(this.year, 11, 31)
	}
	//#endregion
}

class TimeSpan {
	static get zero() { return new TimeSpan(new MoDate, new MoDate) }

	private static getUTCTime(date: Date) {
		return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())
	}

	constructor(private readonly date1: MoDate, private readonly date2: MoDate) { }

	get milliseconds() {
		return TimeSpan.getUTCTime(this.date1) - TimeSpan.getUTCTime(this.date2)
	}

	get seconds() {
		return this.milliseconds / 1000
	}

	get minutes() {
		return this.seconds / 60
	}

	get hours() {
		return this.minutes / 60
	}

	get days() {
		return this.hours / 24
	}

	get weeks() {
		return this.days / 7
	}

	get months() {
		return this.days / 30
	}

	get years() {
		return this.months / 12
	}

	get text() {
		const formatter = new Intl.RelativeTimeFormat(LocalizationHelper.language.value, { style: 'long' })
		switch (true) {
			case Math.abs(this.years) >= 1:
				return formatter.format(Math.floor(this.years), 'years')
			case Math.abs(this.months) >= 1:
				return formatter.format(Math.floor(this.months), 'months')
			case Math.abs(this.weeks) >= 1:
				return formatter.format(Math.floor(this.weeks), 'weeks')
			case Math.abs(this.days) >= 1:
				return formatter.format(Math.floor(this.days), 'days')
			case Math.abs(this.hours) >= 1:
				return formatter.format(Math.floor(this.hours), 'hours')
			case Math.abs(this.minutes) >= 1:
				return formatter.format(Math.floor(this.minutes), 'minutes')
			default:
				return formatter.format(Math.floor(this.seconds), 'seconds')
		}
	}

	toString() {
		return this.text
	}

	valueOf() {
		return this.milliseconds
	}
}

globalThis.TimeSpan = TimeSpan
globalThis.MoDate = MoDate
globalThis.Month = Month
globalThis.WeekDay = WeekDay

type TimeSpanClass = typeof TimeSpan
type MoDateClass = typeof MoDate
type MonthType = Month
type MonthEnum = typeof Month
type WeekDayType = WeekDay
type WeekDayEnum = typeof WeekDay

declare global {
	// eslint-disable-next-line
	var TimeSpan: TimeSpanClass
	// eslint-disable-next-line
	var MoDate: MoDateClass
	type MoDate = InstanceType<MoDateClass>
	// eslint-disable-next-line
	var Month: MonthEnum
	type Month = MonthType
	// eslint-disable-next-line
	var WeekDay: WeekDayEnum
	type WeekDay = WeekDayType
}