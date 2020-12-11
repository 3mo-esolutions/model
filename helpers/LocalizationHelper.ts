import { StorageContainer } from '.'
import { LanguageCode } from '../types'

const localizationHelper = new class LocalizationHelper {
	private readonly languageMap = new Map<LanguageCode, Partial<MoDeL.Localization>>()

	private get currentLanguage() {
		return StorageContainer.Localization.Language.value
	}

	localize<K extends keyof MoDeL.LocalizationParametersMap>(key: K, ...params: MoDeL.LocalizationParametersMap[K]): string {
		// TODO: parameters
		params
		return this.languageMap.get(this.currentLanguage)?.[key] ?? key
	}

	provide(language: LanguageCode, resource: Partial<MoDeL.Localization>) {
		const existingResources = this.languageMap.get(language) ?? {}
		const newResource = { ...existingResources, ...resource }
		this.languageMap.set(language, newResource)
	}
}

export default localizationHelper

globalThis._ = localizationHelper.localize.bind(localizationHelper)

declare global {
	function _(...args: Parameters<typeof localizationHelper.localize>): ReturnType<typeof localizationHelper.localize>

	namespace MoDeL {
		type Localization = Record<keyof LocalizationParametersMap, string>
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface LocalizationParametersMap { }
	}
}