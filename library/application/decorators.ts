import { render } from 'lit-html'
import { DialogAuthenticator } from '.'
import Application from './Application'

export const application = <T extends Application>(applicationConstructor: Constructor<T>) => {
	const app = new applicationConstructor()
	window.document.title = app.title
	MDC.applicationHost.appTitle = app.title
	const div = document.createElement('div')
	div.slot = 'drawerContent'
	render(app.drawerContent, div)
	MDC.applicationHost.appendChild(div)
}

export const authenticator = <T extends DialogAuthenticator>(authenticatorConstructor: Constructor<T>) => {
	MDC.applicationHost.authenticator = new authenticatorConstructor()
}

export const logo = <T extends HTMLElement>(elementConstructor: Constructor<T>) => {
	window.customElements.define('mdc-logo', elementConstructor)
}