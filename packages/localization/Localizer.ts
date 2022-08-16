/* eslint-disable no-console */
import { LocalStorageEntry } from '../utilities'
import { CardinalPluralizationRulesByLanguage } from './CardinalPluralizationRulesByLanguage'

type Dictionary = Map<string, string | Array<string>>

type TranslationPropertyKeys<T extends string> =
	T extends `${string}${'${'}${infer P}${'}'}${infer Rest}` ? P | TranslationPropertyKeys<Rest> : never

export class Localizer {
	static get currentLanguage() {
		return Localizer.languageCodeStorage.value
			?? navigator.language.split('-')[0] as LanguageCode | undefined
			?? LanguageCode.English
	}

	private static readonly languageCodeStorage = new LocalStorageEntry<LanguageCode | undefined>('MoDeL.Localizer.LanguageCode', undefined)
	private static readonly dictionariesByLanguageCode = new Map<LanguageCode, Dictionary>()

	private static readonly regex = /\${(.+?)(?::(.+?))?}/g
	private static readonly pluralityIdentityType = 'pluralityNumber'

	static register(languageCode: LanguageCode, dictionary: Dictionary | Record<string, string | Array<string>>) {
		const d = typeof dictionary === 'object' ? new Map(Object.entries(dictionary)) : dictionary
		const existingDictionary = Localizer.dictionariesByLanguageCode.get(languageCode)
		const newDictionary = new Map([ ...(existingDictionary ?? []), ...d ])
		Localizer.dictionariesByLanguageCode.set(languageCode, newDictionary)
	}

	static get currentLanguageDictionary() {
		return Localizer.dictionariesByLanguageCode.get(Localizer.currentLanguage)
	}

	static localize<TKey extends string>(key: TKey, parameters: Record<TranslationPropertyKeys<TKey>, string>) {
		if (!Localizer.currentLanguageDictionary) {
			console.warn(`[Localizer] No dictionary found for current language "${Localizer.currentLanguage}".`)
		} else if (!Localizer.currentLanguageDictionary.has(key)) {
			console.warn(`[Localizer] Dictionary ${Localizer.currentLanguage} has no localization for "${key}".`)
		}

		return Localizer.getLocalization(key, parameters)
	}

	static matchLocalizationParameters(key: string) {
		return [...key.matchAll(Localizer.regex)]
			.map(([group, key, type]) => ({ group, key, type }))
	}

	static getLocalization<TKey extends string>(key: TKey, parameters: Record<TranslationPropertyKeys<TKey>, string>) {
		const matchedParameters = Localizer.matchLocalizationParameters(key)

		const replace = (text: string, parameterKey: string, parameterValue: string) => {
			const match = matchedParameters.find(p => p.key === parameterKey)
			return !match?.group ? text : text.replace(match.group, parameterValue)
		}

		const replaceAll = (text: string) => {
			return matchedParameters.reduce((acc, p) => replace(acc, p.key!, (parameters as any)[p.key!]), text)
		}

		const localizationOrLocalizations = Localizer.currentLanguageDictionary?.get(key) ?? key
		if (!Array.isArray(localizationOrLocalizations)) {
			return replaceAll(localizationOrLocalizations)
		}
		const pluralityIndexParameterKey = matchedParameters.find(p => p.type === Localizer.pluralityIdentityType)?.key
		const pluralityValue = !pluralityIndexParameterKey ? 0 : (parameters as any)[pluralityIndexParameterKey] || 0
		const pluralityIndex = CardinalPluralizationRulesByLanguage.get(Localizer.currentLanguage)?.(pluralityValue) ?? 0
		return replaceAll(localizationOrLocalizations[pluralityIndex] as string)
	}

	static getLocalizationParameter(key: string, parameter: string) {
		Localizer.matchLocalizationParameters(key).find(p => p.key === parameter)
	}
}

globalThis._ = Localizer.localize

declare global {
	// eslint-disable-next-line no-var
	var _: typeof Localizer.localize

	// namespace MoDeL {
	// 	type LocalizationProvider<K extends keyof LocalizationParametersMap> = (...args: MoDeL.LocalizationParametersMap[K]) => string

	// 	type Localization = {
	// 		[K in keyof LocalizationParametersMap]: string | LocalizationProvider<K>
	// 	}

	// 	interface LocalizationParametersMap { }
	// }
}