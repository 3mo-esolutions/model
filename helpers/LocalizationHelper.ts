import { StorageContainer } from '.'
import { LanguageCode } from '../types'

export default new class LocalizationHelper {
	private readonly languageMap = new Map<LanguageCode, Partial<MDC.Localization>>()

	private get currentLanguage() {
		return StorageContainer.Localization.Language.value
	}

	localize(...args: Parameters<typeof $>): ReturnType<typeof $> {
		const key = args[0]
		return this.languageMap.get(this.currentLanguage)?.[key] ?? key
	}

	provide(language: LanguageCode, resource: Partial<MDC.Localization>) {
		const existingResources = this.languageMap.get(language) ?? {}
		const newResource = { ...existingResources, ...resource }
		this.languageMap.set(language, newResource)
	}
}