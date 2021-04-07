type Rgb = `rgb(${number}, ${number}, ${number})`
type Hex = `#${string}`
type CssProperty = `var(--${string})`
type RgbColor = [R: number, G: number, B: number]

export class Color {
	static isHex(color: string): color is Hex {
		return color.charAt(0) === '#'
	}

	static isRGB(color: string): color is Rgb {
		return color.includes('rgb(')
	}

	static isCssProperty(color: string): color is CssProperty {
		return color.includes('var')
	}

	static hexToRgbColor(hexColor: Hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)

		if (!result) {
			throw new Error('Invalid color')
		}

		return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] as RgbColor
	}

	static rgbToRgbColor(cssRgb: Rgb) {
		return cssRgb.split('rgb(')[1].split(',').map(s => parseInt(s)) as RgbColor
	}

	constructor(...colors: Array<Hex | Rgb | CssProperty>) {
		this.colors = colors.map(color => {
			if (Color.isHex(color))
				return Color.hexToRgbColor(color)

			if (Color.isCssProperty(color)) {
				const rgb = getComputedStyle(MoDeL.application).getPropertyValue(color.split('(')[1].substring(0, color.split('(')[1].length - 1)) as Rgb
				return Color.rgbToRgbColor(rgb)
			}

			return Color.rgbToRgbColor(color)
		})
	}

	private colors = new Array<RgbColor>()

	private get baseColor() {
		if (this.colors.length === 0) {
			throw new Error('No colors found')
		}
		return this.colors[Math.floor((this.colors.length - 1) / 2)]
	}

	get rgb() {
		return `rgb(${this.baseColor.join(',')})` as Rgb
	}

	get hex() {
		const componentToHex = (c: number) => {
			const hex = c.toString(16)
			return hex.length === 1 ? `0${hex}` : hex
		}
		return `#${this.baseColor.map(component => componentToHex(component)).join()}` as Hex
	}
}