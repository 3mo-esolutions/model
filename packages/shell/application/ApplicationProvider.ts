export const applicationProvider = (afterGlobalAuthentication = false) => (ProviderConstructor: Constructor<ApplicationProvider>) => {
	ApplicationProviderHelper.storage.add(new ProviderConstructor(afterGlobalAuthentication))
}

export class ApplicationProviderHelper {
	static readonly storage = new Set<ApplicationProvider>()

	static async provideBeforeGlobalAuthenticationProviders() {
		await Promise.all(Array.from(ApplicationProviderHelper.storage).filter(p => p.afterGlobalAuthentication === false).map(p => p.provide()))
	}

	static async provideAfterGlobalAuthenticationProviders() {
		await Promise.all(Array.from(ApplicationProviderHelper.storage).filter(p => p.afterGlobalAuthentication === true).map(p => p.provide()))
	}
}

export abstract class ApplicationProvider {
	constructor(public afterGlobalAuthentication = false) { }
	abstract provide(): Promise<void>
}