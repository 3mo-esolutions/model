import { css, unsafeCSS } from '@a11d/lit'
import { Application, LocalStorageEntry, RootCssInjector } from '@a11d/lit-application'
import { Color } from '../../utilities'
import { Background } from '.'

export class ThemeHelper {
	static readonly background = new class extends LocalStorageEntry<Background> {
		constructor() {
			super('MoDeL.Theme.Background', Background.System)
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.updateAttributeValue())
			window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => this.updateAttributeValue())
			Application.addInitializer(() => {
				this.updateAttributeValue()
				ThemeHelper.background.changed.subscribe(() => this.updateAttributeValue())
			})
		}

		get calculatedValue() {
			return this.value !== Background.System
				? this.value
				: window.matchMedia('(prefers-color-scheme: dark)').matches
					? Background.Dark
					: Background.Light
		}

		private updateAttributeValue() {
			Application.instance?.setAttribute('data-theme', this.calculatedValue)
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
					--mo-color-accent-base-r:${unsafeCSS(this.value.baseColor![0])};
					--mo-color-accent-base-g:${unsafeCSS(this.value.baseColor![1])};
					--mo-color-accent-base-b:${unsafeCSS(this.value.baseColor![2])};
					--mo-color-accent-gradient-1: ${unsafeCSS(this.value.colors[0])};
					--mo-color-accent-gradient-2: ${unsafeCSS(this.value.colors[1] ?? this.value.colors[0])};
					--mo-color-accent-gradient-3: ${unsafeCSS(this.value.colors[2] ?? this.value.colors[1] ?? this.value.colors[0])};
				}
			`, this.styleElement)
		}
	}
}