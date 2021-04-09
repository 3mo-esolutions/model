import { LocalizationHelper, LocalStorageEntry } from '.'

// REFACTOR

export class FormatHelper {
	static readonly Currency = {
		Symbol: new LocalStorageEntry('MoDeL.Formatter.Currency.Symbol', '€'),
		Code: new LocalStorageEntry('MoDeL.Formatter.Currency.Code', 'EUR'),
		Name: new LocalStorageEntry('MoDeL.Formatter.Currency.Name', 'euro'),
	}
	static readonly Date = {
		Separator: new LocalStorageEntry('MoDeL.Formatter.Date.Separator', '.')
	}
	static readonly Number = {
		Decimal: new LocalStorageEntry('MoDeL.Formatter.Number.Decimal', ','),
		Separator: new LocalStorageEntry('MoDeL.Formatter.Number.Separator', '.'),
	}

	static number(value: number, useSeparator = false): string {
		return new Intl.NumberFormat(LocalizationHelper.Language.value, { maximumFractionDigits: 16, minimumFractionDigits: 0, useGrouping: useSeparator }).format(value)
	}

	static date(value: Date): string | undefined {
		try {
			return new Intl.DateTimeFormat(LocalizationHelper.Language.value, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(value)
		} catch (error) {
			return undefined
		}
	}

	static localDateToDate(value: string): Date | undefined {
		if (!value || value.split('-').join('').length === 0)
			return undefined
		const arr = value.split(FormatHelper.Date.Separator.value)
		return new Date(parseInt(arr[2]), parseInt(arr[1]) - 1, parseInt(arr[0]))
	}

	static percent(value: number): string {
		if (value > 100) value = 100
		if (value < 0) value = 0
		const formatter = new Intl.NumberFormat(LocalizationHelper.Language.value, { style: 'decimal', useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 2 })
		return formatter.format(isNaN(value) ? 0 : value)
	}

	static amountWithSymbol(value: number): string {
		return new Intl.NumberFormat(LocalizationHelper.Language.value, { style: 'currency', currency: FormatHelper.Currency.Code.value, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
	}

	static localAmountWithSymbolToNumber(value: string): number {
		if (!value)
			return 0
		if (typeof value === 'number')
			return value
		value = value.replace('  ', ' ')
		return this.localNumberToNumber(value.substring(0, value.length - 2))
	}

	static amount(value: number): string {
		const formatter = new Intl.NumberFormat(LocalizationHelper.Language.value, { style: 'decimal', useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 })
		return formatter.format(isNaN(value) ? 0 : value)
	}

	static localNumberToNumber(value: string): number {
		if (!value)
			return 0
		const valueArr = value.split(FormatHelper.Number.Decimal.value)
		const isNegative = value.charAt(0) === '-'
		let result = valueArr[0].replace(/\D+/g, '')
		if (valueArr.length === 2) result += '.' + valueArr[1]
		const float = parseFloat(result)
		if (isNaN(float))
			return 0
		return isNegative ? float * -1 : float
	}
}