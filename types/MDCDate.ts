export const enum Month {
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

export const enum WeekDay {
	Sunday,
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
}

type WeekStartDay = Extract<WeekDay, WeekDay.Sunday | WeekDay.Monday>

export class MDCDate extends Date {
	private readonly weekStartDay: WeekStartDay = WeekDay.Monday

	difference(secDate = new MDCDate()): number {
		return Math.floor((Date.UTC(secDate.year, secDate.month, secDate.day) - Date.UTC(this.year, this.month, this.day)) / (1000 * 60 * 60 * 24))
	}

	// Day

	// TODO localization
	static get weekDayNames() {
		return ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
	}

	get day() {
		return this.getDate()
	}

	addDay(days: number) {
		this.setDate(this.day + days)
		return this
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
		return MDCDate.weekDayNames[this.weekDay]
	}

	// Week
	get week() {
		const target = new MDCDate(this.valueOf())
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
		const aDayInTheSpecifiedWeek = new MDCDate(year, Month.January, 1).addDay(7 * (weekNumber - 1))

		const diff = aDayInTheSpecifiedWeek.day - aDayInTheSpecifiedWeek.weekDay + (this.weekStartDay === WeekDay.Sunday ? -6 : 1)
		const weekStart = new MDCDate(aDayInTheSpecifiedWeek.setDate(diff))

		const range = []
		for (let i = 0; i < 7; i++) {
			range.push(new MDCDate(weekStart).addDay(i))
		}

		return range
	}

	// Month
	static get monthNames() {
		// TODO: Localization
		return ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
	}

	get month() {
		return this.getMonth() as Month
	}

	get monthName() {
		return MDCDate.monthNames[this.month]
	}

	get monthStart() {
		return new MDCDate(this.year, this.month, 1)
	}

	get monthEnd() {
		return new MDCDate(this.year, this.month + 1, 0)
	}

	get monthRange() {
		const range = new Array<MDCDate>()
		for (let day = this.monthStart.day; day <= this.monthEnd.day; day++) {
			range.push(new MDCDate(this.year, this.month, day))
		}
		return range
	}

	get monthWeeks() {
		const weekNumbers = this.monthRange.map(date => date.week)
		return weekNumbers.filter((week, index) => weekNumbers.indexOf(week) === index).sort()
	}

	addMonth(months: number) {
		this.setMonth(this.month + months)
		return this
	}

	// Year
	addYear(years: number) {
		this.setFullYear(this.year + years)
		return this
	}

	get year() {
		return this.getFullYear()
	}

	get yearStart() {
		return new MDCDate(this.year, 0, 1)
	}

	get yearEnd() {
		return new MDCDate(this.year, 11, 31)
	}
}