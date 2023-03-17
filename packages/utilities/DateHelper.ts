import { Localizer } from '@3mo/localization'

declare global {
	type DateRange = [start?: MoDate, end?: MoDate]
}

export class DateHelper {
	static readonly dateRangeSeparator = ' – '
	static readonly userDateRangeSeparators = [DateHelper.dateRangeSeparator, ' ', '-', '~']

	static getDateSeparator(language = Localizer.currentLanguage) {
		return Intl.DateTimeFormat(language).format(new Date).replace(/\p{Number}/gu, '')[0]
	}

	static dateTime(value: Date, options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' }) {
		try {
			return Intl.DateTimeFormat(Localizer.currentLanguage, options).format(value)
		} catch {
			return undefined
		}
	}

	static date(value: Date) {
		return this.dateTime(value, { year: 'numeric', month: '2-digit', day: '2-digit' })
	}

	static dateRange(value: DateRange) {
		const [startText, endText] = value.map(d => !d ? undefined : this.date(d))
		return !startText && !endText ? undefined :
			[startText, endText].map(d => d || '').join(DateHelper.dateRangeSeparator)
	}

	static parseDateFromText(dateText: string, referenceDate = new MoDate) {
		dateText = dateText.toLowerCase()

		if (!dateText) {
			return undefined
		}

		if (dateText.startsWith('+') || dateText.startsWith('-')) {
			return DateHelper.parseDateFromOperation(dateText, referenceDate)
		}

		if (dateText.includes(DateHelper.getDateSeparator()!)) {
			return DateHelper.parseDateFromLocalDate(dateText, referenceDate)
		}

		if ((dateText.length === 3 || dateText.length === 4 || dateText.length === 8) && !isNaN(parseInt(dateText))) {
			return DateHelper.parseDateFromShortcut(dateText)
		}

		const date = new MoDate(dateText || new MoDate)
		if (String(date) !== 'Invalid Date') {
			return date
		}

		const keywordDate = DateHelper.parseDateFromKeyword(dateText, referenceDate)
		if (keywordDate) {
			return keywordDate
		}

		return undefined
	}

	static parseDateRangeFromText(dateRangeText: string, referenceDate = new MoDate) {
		const keywordResult = DateHelper.parseDateRangeFromKeyword(dateRangeText, referenceDate)
		if (keywordResult) {
			return keywordResult
		}

		let separator = DateHelper.userDateRangeSeparators.find(separator => dateRangeText.includes(separator))

		if (!separator) {
			dateRangeText += DateHelper.dateRangeSeparator
			separator = DateHelper.dateRangeSeparator
		}

		const [startDateText, endDateText] = dateRangeText.toLowerCase().split(separator)

		const startDate = DateHelper.parseDateFromText(startDateText!, referenceDate)
		const endDate = DateHelper.parseDateFromText(endDateText!, referenceDate)

		return [startDate, endDate] as DateRange
	}

	private static parseDateFromLocalDate(dateText: string, referenceDate = new MoDate) {
		const date = new MoDate(dateText)

		if (String(date) === 'Invalid Date') {
			return undefined
		}

		const dateParts = dateText.split(DateHelper.getDateSeparator()!)

		if (dateParts.length === 2) {
			date.setFullYear(referenceDate.getFullYear())
		}

		return date
	}

	private static parseDateFromOperation(dateText: string, referenceDate = new MoDate) {
		const lastChar = dateText.charAt(dateText.length - 1).toLowerCase()
		let num: number

		if (!isNaN(Number(lastChar))) {
			num = parseInt(dateText.substring(0, dateText.length))
			return referenceDate.addDay(num)
		} else {
			num = parseInt(dateText.substring(0, dateText.length - 1))
			switch (lastChar) {
				case 'y': return referenceDate.addYear(num)
				case 'm': return referenceDate.addMonth(num)
				default: return undefined
			}
		}
	}

	private static parseDateFromShortcut(dateText: string) {
		const day = dateText.substring(0, 2)
		const month = dateText.substring(2, dateText.length >= 4 ? 4 : 3)
		let year = undefined
		if (dateText.length === 8) {
			year = dateText.substring(4, 8)
		}
		const date = new MoDate(year ? parseInt(year) : new Date().getFullYear(), parseInt(month) - 1, parseInt(day))
		return date
	}

	private static parseDateFromKeyword(keyword: string, referenceDate = new MoDate) {
		switch (keyword) {
			case 'h': return new MoDate(referenceDate)
			case 'üm': return referenceDate.addDay(+2)
			case 'm': return referenceDate.addDay(+1)
			case 'üüm': return referenceDate.addDay(+3)
			case 'g': return referenceDate.addDay(-1)
			case 'vg': return referenceDate.addDay(-2)
			case 'vvg': return referenceDate.addDay(-3)
			case 'adw': return referenceDate.weekStart
			case 'edw': return referenceDate.weekEnd
			case 'anw': return referenceDate.addWeek(+1).weekStart
			case 'enw': return referenceDate.addWeek(+1).weekEnd
			case 'alw': return referenceDate.addWeek(-1).weekStart
			case 'elw': return referenceDate.addWeek(-1).weekEnd
			case 'adm': return referenceDate.monthStart
			case 'edm': return referenceDate.monthEnd
			case 'anm': return referenceDate.addMonth(+1).monthStart
			case 'enm': return referenceDate.addMonth(+1).monthEnd
			case 'alm': return referenceDate.addMonth(-1).monthStart
			case 'elm': return referenceDate.addMonth(-1).monthEnd
			case 'adj': return referenceDate.yearStart
			case 'edj': return referenceDate.yearEnd
			case 'anj': return referenceDate.addYear(+1).yearStart
			case 'enj': return referenceDate.addYear(+1).yearEnd
			case 'alj': return referenceDate.addYear(-1).yearStart
			case 'elj': return referenceDate.addYear(-1).yearEnd
			default: return undefined
		}
	}

	private static parseDateRangeFromKeyword(keyword: string, referenceDate = new MoDate): DateRange | undefined {
		switch (keyword) {
			case 'w':
			case 'dw': return [referenceDate.weekStart, referenceDate.weekEnd]
			case 'nw': return [referenceDate.addWeek(+1).weekStart, referenceDate.addWeek(+1).weekEnd]
			case 'lw': return [referenceDate.addWeek(-1).weekStart, referenceDate.addWeek(-1).weekEnd]
			case 'm':
			case 'dm': return [referenceDate.monthStart, referenceDate.monthEnd]
			case 'lm': return [referenceDate.addMonth(-1).monthStart, referenceDate.addMonth(-1).monthEnd]
			case 'nm': return [referenceDate.addMonth(+1).monthStart, referenceDate.addMonth(+1).monthEnd]
			case 'j':
			case 'dj': return [referenceDate.yearStart, referenceDate.yearEnd]
			case 'lj': return [referenceDate.addYear(-1).yearStart, referenceDate.addYear(-1).yearEnd]
			case 'nj': return [referenceDate.addYear(+1).yearStart, referenceDate.addYear(+1).yearEnd]
			default: return undefined
		}
	}
}