import { Application, DialogAuthenticator } from '.'

export const application = <T extends Application>(applicationConstructor: Constructor<T>) => {
	const application = new applicationConstructor()
	window.document.body.appendChild(application)
	window.document.title = application.appTitle ?? ''
}

export const authenticator = <T extends DialogAuthenticator>(authenticatorConstructor: Constructor<T>) => {
	MoDeL.application.authenticatorConstructor = authenticatorConstructor
}

export const logo = <T extends HTMLElement>(elementConstructor: Constructor<T>) => {
	window.customElements.define('mo-logo', elementConstructor)
}