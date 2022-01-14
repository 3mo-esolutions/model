import { FormatHelper } from '../..'

export class DateHelper {
	static parseDateFromText(dateText: string, referenceDate = new MoDate) {
		dateText = dateText.toLowerCase()

		if (!dateText) {
			return undefined
		}

		const date = new Date(dateText || new Date)
		if (String(date) !== 'Invalid Date') {
			return date
		}

		if (dateText.includes(FormatHelper.getDateSeparator())) {
			return DateHelper.parseDateFromLocalDate(dateText, referenceDate)
		}

		if (dateText.startsWith('+') || dateText.startsWith('-')) {
			return DateHelper.parseDateFromOperation(dateText, referenceDate)
		}

		if ((dateText.length === 3 || dateText.length === 4 || dateText.length === 8) && !isNaN(parseInt(dateText))) {
			return DateHelper.parseDateFromShortcut(dateText)
		}

		const keywordDate = DateHelper.parseDateFromKeyword(dateText, referenceDate)
		if (keywordDate) {
			return keywordDate
		}

		return undefined
	}

	private static parseDateFromLocalDate(dateText: string, referenceDate = new MoDate) {
		const dateParts = dateText.split(FormatHelper.getDateSeparator())

		if (dateParts.length === 2) {
			return new Date(referenceDate.getFullYear(), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]))
		}

		if (dateParts.length === 3) {
			return new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]))
		}

		return undefined
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
			case 'adm': return referenceDate.monthStart
			case 'edm': return referenceDate.monthEnd
			case 'adj': return referenceDate.yearStart
			case 'edj': return referenceDate.yearEnd
			default: return undefined
		}
	}
}