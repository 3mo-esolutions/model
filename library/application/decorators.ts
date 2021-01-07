import { Application, DialogAuthenticator, ApplicationProvider } from '.'

export const applicationProvider = (providerConstructor: Constructor<ApplicationProvider>) => {
	Application.providers.add(new providerConstructor)
}

export const application = <T extends Application>(applicationConstructor: Constructor<T>) => {
	const providersPromise = Promise.all(Array.from(Application.providers.keys()).map(provider => provider.provide()))
	providersPromise.then(() => {
		const application = new applicationConstructor()
		window.document.body.appendChild(application)
		window.document.title = application.appTitle ?? ''
	})
}

export const authenticator = <T extends DialogAuthenticator>(authenticatorConstructor: Constructor<T>) => {
	Application.AuthenticatorConstructor = authenticatorConstructor
}

export const logo = <T extends HTMLElement>(elementConstructor: Constructor<T>) => {
	window.customElements.define('mo-logo', elementConstructor)
}