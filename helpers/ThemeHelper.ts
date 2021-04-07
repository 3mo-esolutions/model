import { css, unsafeCSS } from '../library'
import { DocumentHelper, LocalStorageEntry } from '.'
import { Accent, Background } from '../types'

export class ThemeHelper {
	static readonly Background = new class extends LocalStorageEntry<Background> {
		constructor() {
			super('MoDeL.Theme.Theme', Background.System)
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.value = this.calculatedValue)
		}

		get calculatedValue() {
			return this.value === Background.System
				? window.matchMedia('(prefers-color-scheme: dark)').matches
					? Background.Dark
					: Background.Light
				: this.value
		}
	}

	static readonly Accent = new class extends LocalStorageEntry<Accent> {
		constructor() {
			super('MoDeL.Theme.Accent', Accent.Blue)
			this.value = this.value ?? this.defaultValue
		}

		private styleElement?: HTMLStyleElement

		get value() { return super.value }
		set value(value) {
			super.value = value
			const colors = value.split('/')
			const accentBase = colors[1] ?? colors[0]
			const accentBaseRGB = accentBase.split(',')
			// TODO: MD-111: refactor gradient?
			this.styleElement = DocumentHelper.injectCSS(css`
				#application {
					--mo-accent-gradient-1: ${unsafeCSS(colors[0])};
					--mo-accent-gradient-2: ${unsafeCSS(accentBase)};
					--mo-accent-gradient-3: ${unsafeCSS(colors[2] ?? colors[1] ?? colors[0])};
					--mo-accent-base-r:${unsafeCSS(accentBaseRGB[0])};
					--mo-accent-base-g:${unsafeCSS(accentBaseRGB[1])};
					--mo-accent-base-b:${unsafeCSS(accentBaseRGB[2])};
				}
			`, this.styleElement)
		}
	}
}