import { LocalizationHelper } from '.'

export class FormatHelper {
	static readonly dateRangeSeparator = ' – '

	static getDateSeparator(language = LocalizationHelper.language.value) {
		return Intl.DateTimeFormat(language).format(new Date).replace(/\p{Number}/gu, '')[0]
	}

	static getDecimalSeparator(language = LocalizationHelper.language.value) {
		return Intl.NumberFormat(language).format(1.1).replace(/\p{Number}/gu, '')
	}

	static getThousandSeparator(language = LocalizationHelper.language.value) {
		return Intl.NumberFormat(language).format(11111).replace(/\p{Number}/gu, '')
	}

	static getCurrencySymbol(currency: CurrencyCode) {
		try {
			return Intl.NumberFormat('de-DE', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(1).replace(/\p{Number}/gu, '').trim()
		} catch {
			return ''
		}
	}

	static number(value: number, options: Intl.NumberFormatOptions = { maximumFractionDigits: 16, minimumFractionDigits: 0, useGrouping: false }): string {
		try {
			return Intl.NumberFormat(LocalizationHelper.language.value, options).format(value || 0)
		} catch {
			return this.number(0, options)
		}
	}

	static percent(value: number) {
		const percentage = value > 100 ? 100
			: value < 0 ? 0
				: value
		return this.number(percentage, { style: 'decimal', useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 2 })
	}

	static amount(value: number, additionalOptions?: Intl.NumberFormatOptions) {
		return this.number(value, { style: 'decimal', useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2, ...(additionalOptions ?? {}) })
	}

	static amountWithSymbol(value: number, currency = CurrencyCode.EUR) {
		return this.number(value, { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })
	}

	static localNumberToNumber(value: string, language = LocalizationHelper.language.value) {
		const numberString = String(value || '0').replace(/ /g, '')

		const thousandSeparator = this.getThousandSeparator(language)
		const decimalSeparator = this.getDecimalSeparator(language)

		const number = parseFloat(numberString
			.replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
			.replace(new RegExp(`\\${decimalSeparator}`), '.')
		)
		return Number.isNaN(number) ? undefined : number
	}

	static localAmountWithSymbolToNumber(value: string, language = LocalizationHelper.language.value) {
		const amountString = String(value || '0').replace(/ /g, '')
		return this.localNumberToNumber(amountString.substring(0, amountString.length - 1), language)
	}

	static dateTime(value: Date, options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' }) {
		try {
			return Intl.DateTimeFormat(LocalizationHelper.language.value, options).format(value)
		} catch {
			return undefined
		}
	}

	static date(value: Date) {
		return this.dateTime(value, { year: 'numeric', month: '2-digit', day: '2-digit' })
	}

	static localDateToDate(value: string, language = LocalizationHelper.language.value) {
		language // No need for now. Will be needed for non-latin langauges.
		const date = new Date(value)
		return String(date) === 'Invalid Date' ? undefined : date
	}

	static dateRange(value: DateRange) {
		const startText = value[0] ? this.date(value[0]) : undefined
		const endText = value[1] ? this.date(value[1]) : undefined
		return !startText && !endText ? undefined : `${startText || ''}${FormatHelper.dateRangeSeparator}${endText || ''}`
	}
}