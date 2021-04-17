import { Application, DialogAuthenticator, ApplicationProvider } from '.'

export const applicationProvider = (afterAuthentication = false) => (providerConstructor: Constructor<ApplicationProvider>) => {
	const provider = new providerConstructor
	provider.afterAuthentication = afterAuthentication
	Application.providers.add(provider)
}

export const application = <T extends Application>(applicationConstructor: Constructor<T>) => {
	const process = async () => {
		const providers = Array.from(Application.providers.keys())
		await Promise.all(providers.filter(p => p.afterAuthentication === false).map(p => p.provide()))
		const application = new applicationConstructor()
		window.document.body.appendChild(application)
		window.document.title = Manifest.short_name ?? ''
	}
	process()
}

export const authenticator = <T extends DialogAuthenticator>(authenticatorConstructor: Constructor<T>) => {
	Application.AuthenticatorConstructor = authenticatorConstructor
}