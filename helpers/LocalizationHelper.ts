import { StorageContainer } from '.'
import { LanguageCode } from '../types'

const localizationHelper = new class LocalizationHelper {
	private readonly languageMap = new Map<LanguageCode, MoDeL.Localization>()

	private get currentLanguage() {
		return StorageContainer.Localization.Language.value
	}

	localize<K extends keyof MoDeL.LocalizationParametersMap>(key: K, ...params: MoDeL.LocalizationParametersMap[K]): string {
		const currentLanguageDictionary = this.languageMap.get(this.currentLanguage)

		if (!currentLanguageDictionary)
			return key

		const translation = currentLanguageDictionary[key] as MoDeL.Localization[K] | undefined

		if (translation === undefined)
			return key

		if (typeof translation === 'string')
			return translation

		const translationProvider = translation as MoDeL.LocalizationProvider<K>
		return translationProvider(...params)
	}

	provide(language: LanguageCode, resource: Partial<MoDeL.Localization>) {
		const existingResources = this.languageMap.get(language) ?? {}
		const newResource = { ...existingResources, ...resource } as MoDeL.Localization
		this.languageMap.set(language, newResource)
	}
}

export default localizationHelper

globalThis._ = localizationHelper.localize.bind(localizationHelper)

declare global {
	// REFACTOR: why ...args: Parameters<typeof localizationHelper.localize> does not work?
	function _<K extends keyof MoDeL.LocalizationParametersMap>(key: K, ...params: MoDeL.LocalizationParametersMap[K]): ReturnType<typeof localizationHelper.localize>

	namespace MoDeL {
		type LocalizationProvider<K extends keyof LocalizationParametersMap> = (...args: MoDeL.LocalizationParametersMap[K]) => string

		type Localization = {
			[K in keyof LocalizationParametersMap]: string | LocalizationProvider<K>
		}

		interface LocalizationParametersMap { }
	}
}