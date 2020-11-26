import { localStorageEntryBuilder, LocalStorageEntry } from '.'
import { Accents, LanguageCode, Themes, User } from '../types'

export default {
	Theme: {
		Background: new class extends localStorageEntryBuilder<Themes>('MDC.Theme.Background', Themes.System) {
			constructor() {
				super()

				window.matchMedia('(prefers-color-scheme: dark)').addListener(() => this.value = this.value)

				this.changed.subscribe(theme => {
					if (theme !== Themes.System) {
						MDC.applicationHost.theme = theme
						return
					}
					const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
					MDC.applicationHost.theme = isDark ? Themes.Dark : Themes.Light
				})
			}
		},
		Accent: new class extends localStorageEntryBuilder<Accents>('MDC.Theme.Accent', Accents.Blue) {
			constructor() {
				super()
				this.changed.subscribe(value => {
					const colors = value.split('/')
					const firstColorRgb = colors[0].split(',').map(c => parseInt(c))
					const lastColorRgb = colors[colors.length - 1].split(',').map(c => parseInt(c))

					const mixed = this.colorMixer([firstColorRgb[0], firstColorRgb[1], firstColorRgb[2]], [lastColorRgb[0], lastColorRgb[1], lastColorRgb[2]])
					MDC.applicationHost.style.setProperty('--mdc-accent-base', mixed.join(','))

					let accentG = ''
					let accentGT = ''

					for (let i = 0; i < colors.length; i++) {
						const colorRGB = colors[i]
						const percent = i / colors.length * 100
						accentG += `rgb(${colorRGB}) ${percent}% ${i === colors.length - 1 ? '' : ','}`
						accentGT += `rgba(${colorRGB},0.25) ${percent}% ${i === colors.length - 1 ? '' : ','}`
					}

					MDC.applicationHost.style.setProperty('--mdc-accent-g', accentG)
					MDC.applicationHost.style.setProperty('--mdc-accent-gt', accentGT)
				})
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
			IsDocked: new LocalStorageEntry('MDC.Components.Drawer.IsDocked', false)
		},
	},
	Localization: {
		Language: new LocalStorageEntry<LanguageCode>('MDC.Localization.Language', navigator.language.split('-')[0] as LanguageCode),
		Currency: {
			Symbol: new LocalStorageEntry('MDC.Localization.Currency.Symbol', '€'),
			Code: new LocalStorageEntry('MDC.Localization.Currency.Code', 'EUR'),
			Name: new LocalStorageEntry('MDC.Localization.Currency.Name', 'euro'),
		},
		Date: {
			Seperator: new LocalStorageEntry('MDC.Localization.Date.Seperator', '.')
		},
		Number: {
			Decimal: new LocalStorageEntry('MDC.Localization.Number.Decimal', ','),
			Seperator: new LocalStorageEntry('MDC.Localization.Number.Seperator', '.'),
		},
	},
	Authentication: {
		isAuthenticated: new LocalStorageEntry('MDC.Authentication.IsAuthenticated', false),
		Password: new LocalStorageEntry<string | undefined>('authenticationPassword', undefined),
		ShallRemember: new LocalStorageEntry('MDC.Authentication.ShallRemember', false),
		Username: new LocalStorageEntry<string | undefined>('MDC.Authentication.Username', undefined),
		User: new class extends localStorageEntryBuilder<User | undefined>('MDC.User', undefined) {
			get value() { return super.value }
			set value(value) {
				super.value = value
				MDC.applicationHost.authenticatedUser = value
			}
		},
	},
	DeletionConfirmation: new LocalStorageEntry('MDC.DeletionConfirmation', true),
	FeatureFlags: new LocalStorageEntry('MDC.FeatureFlags', new Array<keyof MDC.FeatureFlags>()),
	Permissions: new LocalStorageEntry('MDC.Permissions', new Array<keyof MDC.Permissions>()),
}