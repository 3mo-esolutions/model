import { css, unsafeCSS } from '../library'
import { DocumentHelper, LocalStorageEntry } from '.'
import { Background, Color } from '../types'

export class ThemeHelper {
	static readonly background = new class extends LocalStorageEntry<Background> {
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

	static readonly accent = new class extends LocalStorageEntry<Color> {
		constructor() {
			super(
				'MoDeL.Theme.Accent',
				new Color('rgb(0, 119, 200)'),
				(key: string, value: any) => key.length === 0 ? new Color(...value.colors) : value
			)
			this.value = this.value ?? this.defaultValue
		}

		private styleElement?: HTMLStyleElement

		get value() { return super.value }
		set value(value) {
			super.value = value
			this.styleElement = DocumentHelper.injectCSS(css`
				#application {
					--mo-accent-base-r:${unsafeCSS(value.baseColor[0])};
					--mo-accent-base-g:${unsafeCSS(value.baseColor[1])};
					--mo-accent-base-b:${unsafeCSS(value.baseColor[2])};
					--mo-accent-gradient-1: ${unsafeCSS(value.colors[0])};
					--mo-accent-gradient-2: ${unsafeCSS(value.colors[1] ?? value.colors[0])};
					--mo-accent-gradient-3: ${unsafeCSS(value.colors[2] ?? value.colors[1] ?? value.colors[0])};
				}
			`, this.styleElement)
		}
	}
}