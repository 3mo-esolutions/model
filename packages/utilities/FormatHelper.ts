import { LocalizationHelper, LocalStorageEntry } from '.'

// REFACTOR

export class FormatHelper {
	static readonly storage = {
		currency: {
			symbol: new LocalStorageEntry('MoDeL.Formatter.Currency.Symbol', '€'),
			code: new LocalStorageEntry('MoDeL.Formatter.Currency.Code', 'EUR'),
			name: new LocalStorageEntry('MoDeL.Formatter.Currency.Name', 'euro'),
		},
		date: {
			separator: new LocalStorageEntry('MoDeL.Formatter.Date.Separator', '.')
		},
		number: {
			decimal: new LocalStorageEntry('MoDeL.Formatter.Number.Decimal', ','),
			separator: new LocalStorageEntry('MoDeL.Formatter.Number.Separator', '.'),
		}
	}

	static number(value: number, useSeparator = false) {
		return new Intl.NumberFormat(LocalizationHelper.language.value, { maximumFractionDigits: 16, minimumFractionDigits: 0, useGrouping: useSeparator }).format(value)
	}

	static date(value: Date) {
		try {
			return new Intl.DateTimeFormat(LocalizationHelper.language.value, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(value)
		} catch (error) {
			return undefined
		}
	}

	static dateTime(value: Date) {
		try {
			return new Intl.DateTimeFormat(LocalizationHelper.language.value, { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(value)
		} catch (error) {
			return undefined
		}
	}

	static localDateToDate(value: string) {
		if (!value || value.split('-').join('').length === 0) {
			return undefined
		}
		const arr = value.split(FormatHelper.storage.date.separator.value)
		return new Date(parseInt(arr[2]), parseInt(arr[1]) - 1, parseInt(arr[0]))
	}

	static percent(value: number) {
		if (value > 100) {
			value = 100
		}
		if (value < 0) {
			value = 0
		}
		const formatter = new Intl.NumberFormat(LocalizationHelper.language.value, { style: 'decimal', useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 2 })
		return formatter.format(isNaN(value) ? 0 : value)
	}

	static amountWithSymbol(value: number) {
		return new Intl.NumberFormat(LocalizationHelper.language.value, { style: 'currency', currency: FormatHelper.storage.currency.code.value, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
	}

	static localAmountWithSymbolToNumber(value: string) {
		if (!value) {
			return 0
		}
		if (typeof value === 'number') {
			return value
		}
		value = value.replace('  ', ' ')
		return this.localNumberToNumber(value.substring(0, value.length - 2))
	}

	static amount(value: number) {
		const formatter = new Intl.NumberFormat(LocalizationHelper.language.value, { style: 'decimal', useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 })
		return formatter.format(isNaN(value) ? 0 : value)
	}

	static localNumberToNumber(value: string) {
		if (!value) {
			return 0
		}
		const valueArr = value.split(FormatHelper.storage.number.decimal.value)
		const isNegative = value.startsWith('-')
		let result = valueArr[0].replace(/\D+/g, '')
		if (valueArr.length === 2) {
			result += `.${valueArr[1]}`
		}
		const float = parseFloat(result)
		if (isNaN(float)) {
			return 0
		}
		return isNegative ? float * -1 : float
	}
}