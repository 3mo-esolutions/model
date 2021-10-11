import { LocalStorageEntry } from '.'

export class LocalizationHelper {
	static readonly language = new LocalStorageEntry<LanguageCode>('MoDeL.Localization.Language', navigator.language.split('-')[0] as LanguageCode)

	private static readonly languageMap = new Map<LanguageCode, MoDeL.Localization>()

	private static get currentLanguage() {
		return LocalizationHelper.language.value
	}

	static localize = <K extends keyof MoDeL.LocalizationParametersMap>(key: K, ...params: MoDeL.LocalizationParametersMap[K]) => {
		const currentLanguageDictionary = LocalizationHelper.languageMap.get(LocalizationHelper.currentLanguage)

		if (!currentLanguageDictionary) {
			return key
		}

		const translation = currentLanguageDictionary[key] as MoDeL.Localization[K] | undefined

		if (translation === undefined) {
			return key
		}

		if (typeof translation === 'string') {
			return translation
		}

		const translationProvider = translation as MoDeL.LocalizationProvider<K>
		return translationProvider(...params)
	}

	static provide = (language: LanguageCode, resource: Partial<MoDeL.Localization>) => {
		const existingResources = LocalizationHelper.languageMap.get(language) ?? {}
		const newResource = { ...existingResources, ...resource } as MoDeL.Localization
		LocalizationHelper.languageMap.set(language, newResource)
	}
}

globalThis._ = LocalizationHelper.localize

declare global {
	// eslint-disable-next-line no-var
	var _: typeof LocalizationHelper.localize

	namespace MoDeL {
		type LocalizationProvider<K extends keyof LocalizationParametersMap> = (...args: MoDeL.LocalizationParametersMap[K]) => string

		type Localization = {
			[K in keyof LocalizationParametersMap]: string | LocalizationProvider<K>
		}

		interface LocalizationParametersMap { }
	}
}