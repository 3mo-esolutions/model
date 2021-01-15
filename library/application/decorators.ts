import { Application, DialogAuthenticator, ApplicationProvider } from '.'

export const applicationProvider = (differ = false) => (providerConstructor: Constructor<ApplicationProvider>) => {
	const provider = new providerConstructor
	provider.differ = differ
	Application.providers.add(provider)
}

export const application = <T extends Application>(applicationConstructor: Constructor<T>) => {
	const process = async () => {
		const providers = Array.from(Application.providers.keys())
		await Promise.all(providers.filter(p => p.differ === false).map(p => p.provide()))
		await Promise.all(providers.filter(p => p.differ === true).map(p => p.provide()))
		const application = new applicationConstructor()
		window.document.body.appendChild(application)
		window.document.title = application.appTitle ?? ''
	}
	process()
}

export const authenticator = <T extends DialogAuthenticator>(authenticatorConstructor: Constructor<T>) => {
	Application.AuthenticatorConstructor = authenticatorConstructor
}

export const logo = <T extends HTMLElement>(elementConstructor: Constructor<T>) => {
	window.customElements.define('mo-logo', elementConstructor)
}