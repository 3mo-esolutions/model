import { css, unsafeCSS } from '../library'
import { DocumentHelper, LocalStorageEntry } from '.'
import { Accents, Background } from '../types'

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

	static readonly Accent = new class extends LocalStorageEntry<Accents> {
		constructor() {
			super('MoDeL.Theme.Accent', Accents.StrongBlissGradient)
			this.value = this.defaultValue
		}

		private styleElement?: HTMLStyleElement

		get value() { return super.value }
		set value(value) {
			const colors = value.split('/')
			this.styleElement = DocumentHelper.injectCSS(css`
				#application {
					--mo-accent-gradient-1: ${unsafeCSS(colors[0])};
					--mo-accent-gradient-2: ${unsafeCSS(colors[1] ?? colors[0])};
					--mo-accent-gradient-3: ${unsafeCSS(colors[2] ?? colors[1] ?? colors[0])};
				}
			`, this.styleElement)
		}
	}
}