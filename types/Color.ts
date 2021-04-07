export class Color {
	static isHex(color: string) {
		return color.charAt(0) === '#'
	}

	static isRGB(color: string) {
		return color.charAt(0) === '#'
	}

	static hexToRgb(hexColor: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)

		if (!result) {
			throw new Error('Invalid color')
		}

		return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
	}

	constructor(cssColor: string) {
		const cssRgb = this.extractRgbTuple(cssColor)
		const rgbTuple = cssRgb.split('rgb(')[1].split(',').map(s => parseInt(s))
		this._r = rgbTuple[0]
		this._g = rgbTuple[1]
		this._b = rgbTuple[2]
	}

	private extractRgbTuple(cssColor: string) {
		if (Color.isHex(cssColor))
			return Color.hexToRgb(cssColor)

		if (cssColor.includes('var')) {
			return getComputedStyle(MoDeL.application).getPropertyValue(cssColor.split('(')[1].substring(0, cssColor.split('(')[1].length - 1))
		}

		return cssColor
	}

	private _r = 0
	private _g = 0
	private _b = 0
	get r() { return this._r }
	get g() { return this._g }
	get b() { return this._b }

	get cssRgb() {
		return `rgb(${this._r}, ${this._g}, ${this._b})`
	}

	get cssHex() {
		const componentToHex = (c: number) => {
			const hex = c.toString(16)
			return hex.length === 1 ? `0${hex}` : hex
		}
		return `#${componentToHex(this._r)}${componentToHex(this._g)}${componentToHex(this._b)}`
	}
}