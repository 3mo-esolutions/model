import { LocalStorageEntry } from '.'
import { Accents, Themes } from '../types'

type Color = [R: number, G: number, B: number]

export default class ThemeHelper {
	static readonly Accent = new LocalStorageEntry('MoDeL.Theme.Accent', Accents.Blue)
	static readonly Background = new LocalStorageEntry('MoDeL.Theme.Background', Themes.System)

	static handleAccentChange(value: Accents) {
		const colors = value.split('/')
		const firstColorRgb = colors[0].split(',').map(c => parseInt(c))
		const lastColorRgb = colors[colors.length - 1].split(',').map(c => parseInt(c))

		const mixed = this.mix([firstColorRgb[0], firstColorRgb[1], firstColorRgb[2]], [lastColorRgb[0], lastColorRgb[1], lastColorRgb[2]])
		document.documentElement.style.setProperty('--mo-accent-base', mixed.join(','))

		let accentGradient = ''
		let accentGradientTransparent = ''

		for (let i = 0; i < colors.length; i++) {
			const colorRGB = colors[i]
			const percent = i / colors.length * 100
			accentGradient += `rgb(${colorRGB}) ${percent}% ${i === colors.length - 1 ? '' : ','}`
			accentGradientTransparent += `rgba(${colorRGB},0.25) ${percent}% ${i === colors.length - 1 ? '' : ','}`
		}

		document.documentElement.style.setProperty('--mo-accent-g', accentGradient)
		document.documentElement.style.setProperty('--mo-accent-gt', accentGradientTransparent)
	}

	static mix(firstColor: Color, secondColor: Color, amountToMix = 0.5) {
		const r = this.mixChannel(firstColor[0], secondColor[0], amountToMix)
		const g = this.mixChannel(firstColor[1], secondColor[1], amountToMix)
		const b = this.mixChannel(firstColor[2], secondColor[2], amountToMix)
		return [r, g, b] as Color
	}

	private static mixChannel(colorChannelA: number, colorChannelB: number, amountToMix = 0.5) {
		const channelA = colorChannelA * amountToMix
		const channelB = colorChannelB * (1 - amountToMix)
		return channelA + channelB
	}
}

ThemeHelper.Accent.changed.subscribe(value => ThemeHelper.handleAccentChange(value))
ThemeHelper.handleAccentChange(ThemeHelper.Accent.value)