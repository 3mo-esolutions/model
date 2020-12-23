import { localStorageEntryBuilder, LocalStorageEntry, PromiseTask } from '.'
import { Accents, LanguageCode, Themes, User } from '../types'

export default {
	Theme: {
		Background: new class extends localStorageEntryBuilder<Themes>('MoDeL.Theme.Background', Themes.System) {
			constructor() {
				super()
				this.handleChange()
				this.changed.subscribe(() => this.handleChange())
				window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.value = this.value)
			}

			private async handleChange() {
				if (this.value !== Themes.System) {
					MoDeL.application.theme = this.value
					return
				}
				const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
				PromiseTask.delegateToEventLoop(() => MoDeL.application.theme = isDark ? Themes.Dark : Themes.Light)
			}
		},

		Accent: new class extends localStorageEntryBuilder<Accents>('MoDeL.Theme.Accent', Accents.Blue) {
			constructor() {
				super()
				this.handleChange()
				this.changed.subscribe(() => this.handleChange())
			}

			private handleChange() {
				const colors = this.value.split('/')
				const firstColorRgb = colors[0].split(',').map(c => parseInt(c))
				const lastColorRgb = colors[colors.length - 1].split(',').map(c => parseInt(c))

				const mixed = this.colorMixer([firstColorRgb[0], firstColorRgb[1], firstColorRgb[2]], [lastColorRgb[0], lastColorRgb[1], lastColorRgb[2]])
				document.documentElement.style.setProperty('--mo-accent-base', mixed.join(','))

				let accentG = ''
				let accentGT = ''

				for (let i = 0; i < colors.length; i++) {
					const colorRGB = colors[i]
					const percent = i / colors.length * 100
					accentG += `rgb(${colorRGB}) ${percent}% ${i === colors.length - 1 ? '' : ','}`
					accentGT += `rgba(${colorRGB},0.25) ${percent}% ${i === colors.length - 1 ? '' : ','}`
				}

				document.documentElement.style.setProperty('--mo-accent-g', accentG)
				document.documentElement.style.setProperty('--mo-accent-gt', accentGT)
			}

			private colorMixer(rgbA: [R: number, G: number, B: number], rgbB: [R: number, G: number, B: number], amountToMix = 0.5): [R: number, G: number, B: number] {
				const r = this.colorChannelMixer(rgbA[0], rgbB[0], amountToMix)
				const g = this.colorChannelMixer(rgbA[1], rgbB[1], amountToMix)
				const b = this.colorChannelMixer(rgbA[2], rgbB[2], amountToMix)
				return [r, g, b]
			}

			private colorChannelMixer(colorChannelA: number, colorChannelB: number, amountToMix = 0.5): number {
				const channelA = colorChannelA * amountToMix
				const channelB = colorChannelB * (1 - amountToMix)
				return channelA + channelB
			}

			random() {
				this.value = this.randomEnum(Accents)
			}

			private randomEnum<T>(anEnum: T): T[keyof T] {
				const enumValues = Object.keys(anEnum)
					.map(n => Number.parseInt(n))
					.filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
				const randomIndex = Math.floor(Math.random() * enumValues.length)
				const randomEnumValue = enumValues[randomIndex]
				return randomEnumValue
			}
		}
	},
	Components: {
		Drawer: {
			IsDocked: new LocalStorageEntry('MoDeL.Components.Drawer.IsDocked', false)
		},
	},
	Localization: {
		Language: new LocalStorageEntry<LanguageCode>('MoDeL.Localization.Language', navigator.language.split('-')[0] as LanguageCode),
		Currency: {
			Symbol: new LocalStorageEntry('MoDeL.Localization.Currency.Symbol', '€'),
			Code: new LocalStorageEntry('MoDeL.Localization.Currency.Code', 'EUR'),
			Name: new LocalStorageEntry('MoDeL.Localization.Currency.Name', 'euro'),
		},
		Date: {
			Seperator: new LocalStorageEntry('MoDeL.Localization.Date.Seperator', '.')
		},
		Number: {
			Decimal: new LocalStorageEntry('MoDeL.Localization.Number.Decimal', ','),
			Seperator: new LocalStorageEntry('MoDeL.Localization.Number.Seperator', '.'),
		},
	},
	Authentication: {
		Password: new LocalStorageEntry<string | undefined>('authenticationPassword', undefined),
		ShallRemember: new LocalStorageEntry('MoDeL.Authentication.ShallRemember', false),
		Username: new LocalStorageEntry<string | undefined>('MoDeL.Authentication.Username', undefined),
		AuthenticatedUser: new LocalStorageEntry<User | undefined>('MoDeL.AuthenticatedUser', undefined),
	},
	DeletionConfirmation: new LocalStorageEntry('MoDeL.DeletionConfirmation', true),
	FeatureFlags: new LocalStorageEntry('MoDeL.FeatureFlags', new Array<keyof MoDeL.FeatureFlags>()),
	Permissions: new LocalStorageEntry('MoDeL.Permissions', new Array<keyof MoDeL.Permissions>()),
}