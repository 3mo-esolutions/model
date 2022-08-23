type Rgb = `rgb(${number}, ${number}, ${number})`
type Hex = `#${string}`
type CssProperty = `var(--${string})`
type RgbTuple = [R: number, G: number, B: number]

export class Color {
	static isRgbColor(color: Array<number>): color is RgbTuple {
		return color.length === 3
	}

	static isHex(color: string): color is Hex {
		return color.startsWith('#')
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

		const [, r, g, b] = result
		return [parseInt(r!, 16), parseInt(g!, 16), parseInt(b!, 16)] as RgbTuple
	}

	static rgbToRgbColor(cssRgb: Rgb) {
		return cssRgb.split('rgb(')[1]!.split(',').map(s => parseInt(s)) as RgbTuple
	}

	readonly colors = new Array<RgbTuple>()

	constructor(...colors: Array<RgbTuple | Hex | Rgb | CssProperty>) {
		this.colors = colors.map(color => {
			if (color instanceof Array) {
				return color
			}

			if (Color.isHex(color)) {
				return Color.hexToRgbColor(color)
			}

			if (Color.isCssProperty(color)) {
				const c = color.split('(')[1]!
				const rgb = getComputedStyle(MoDeL.application).getPropertyValue(c.substring(0, c.length - 1)) as Rgb
				return Color.rgbToRgbColor(rgb)
			}

			return Color.rgbToRgbColor(color)
		})
	}

	get isGradient() {
		return this.colors.length > 1
	}

	get baseColor() {
		if (this.colors.length === 0) {
			throw new Error('No colors found')
		}
		return this.colors[Math.floor((this.colors.length - 1) / 2)]
	}

	get baseRgb() {
		return `rgb(${this.baseColor!.join(',')})` as Rgb
	}

	get baseHex() {
		const componentToHex = (c: number) => {
			const hex = c.toString(16)
			return hex.length === 1 ? `0${hex}` : hex
		}
		return `#${this.baseColor!.map(component => componentToHex(component)).join('')}` as Hex
	}
}