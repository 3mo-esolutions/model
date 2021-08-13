export default class CssHelper {
	static isAsteriskSyntax(length: string) {
		return (length.includes('*') === true && length.includes('calc') === false)
	}

	static getFlexGrowFromAsteriskSyntax(length: string) {
		return length === '*'
			? 1
			: parseInt(length.split('*')[0])
	}

	static getAlignmentFromTextAlign(textAlign: string) {
		switch (textAlign) {
			case 'center':
				return 'center'
			case 'right':
				return 'flex-end'
			default:
				return 'flex-start'
		}
	}

	static getGridFractionFromAsteriskSyntax(value: string) {
		if (value === '*') {
			return '1fr'
		}
		return value.replace('*', 'fr')
	}
}