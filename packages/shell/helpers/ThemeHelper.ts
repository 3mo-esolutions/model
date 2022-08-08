import { css, unsafeCSS } from '../../library'
import { LocalStorageEntry, Color, RootCssInjector } from '../../utilities'
import { Background } from '.'

export class ThemeHelper {
	static readonly background = new class extends LocalStorageEntry<Background> {
		constructor() {
			super('MoDeL.Theme.Background', Background.System)
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.value = this.calculatedValue)
		}

		get calculatedValue() {
			return this.value !== Background.System
				? this.value
				: window.matchMedia('(prefers-color-scheme: dark)').matches
					? Background.Dark
					: Background.Light
		}
	}

	static readonly accent = new class extends LocalStorageEntry<Color> {
		private styleElement?: HTMLStyleElement

		constructor() {
			super(
				'MoDeL.Theme.Accent',
				new Color('rgb(0, 119, 200)'),
				(key: string, value: any) => key.length === 0 ? new Color(...value.colors) : value
			)
			this.injectCss()
		}

		override get value() { return super.value }
		override set value(value) {
			super.value = value
			this.injectCss()
		}

		injectCss() {
			this.styleElement = RootCssInjector.inject(css`
				[application] {
					--mo-accent-base-r:${unsafeCSS(this.value.baseColor[0])};
					--mo-accent-base-g:${unsafeCSS(this.value.baseColor[1])};
					--mo-accent-base-b:${unsafeCSS(this.value.baseColor[2])};
					--mo-accent-gradient-1: ${unsafeCSS(this.value.colors[0])};
					--mo-accent-gradient-2: ${unsafeCSS(this.value.colors[1] ?? this.value.colors[0])};
					--mo-accent-gradient-3: ${unsafeCSS(this.value.colors[2] ?? this.value.colors[1] ?? this.value.colors[0])};
				}
			`, this.styleElement)
		}
	}
}