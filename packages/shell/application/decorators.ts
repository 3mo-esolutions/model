import { Application, DialogAuthenticator, ApplicationProvider } from '.'

export const applicationProvider = (afterAuthentication = false) => (ProviderConstructor: Constructor<ApplicationProvider>) => {
	const provider = new ProviderConstructor
	provider.afterAuthentication = afterAuthentication
	Application.providers.add(provider)
}

export const application = <T extends Application>(ApplicationConstructor: Constructor<T>) => {
	window.document.body.appendChild(new ApplicationConstructor)
}

export const authenticator = <T extends DialogAuthenticator>(authenticatorConstructor: Constructor<T>) => {
	Application.AuthenticatorConstructor = authenticatorConstructor
}