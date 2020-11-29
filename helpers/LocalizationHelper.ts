import { StorageContainer } from '.'
import { LanguageCode } from '../types'

const localizationHelper = new class LocalizationHelper {
	private readonly languageMap = new Map<LanguageCode, Partial<MoDeL.Localization>>()

	private get currentLanguage() {
		return StorageContainer.Localization.Language.value
	}

	localize(...args: Parameters<typeof $>): ReturnType<typeof $> {
		const key = args[0]
		return this.languageMap.get(this.currentLanguage)?.[key] ?? key
	}

	provide(language: LanguageCode, resource: Partial<MoDeL.Localization>) {
		const existingResources = this.languageMap.get(language) ?? {}
		const newResource = { ...existingResources, ...resource }
		this.languageMap.set(language, newResource)
	}
}

// @ts-ignore Setting the global localizer
globalThis.$ = localizationHelper.localize.bind(localizationHelper)
export default localizationHelper