import { DialogAuthenticator, PageComponent } from '..'
import { Application, ApplicationProviderHelper } from '../application'

type AuthenticationComponent = PageComponent<any> | Application
type AuthenticatorComponent = DialogAuthenticator

export const authenticator = () => <T extends AuthenticatorComponent>(AuthenticatorConstructor: Constructor<T>) => {
	AuthenticationHelper.AuthenticatorConstructor = AuthenticatorConstructor
}

export const authentication = () => <T extends AuthenticationComponent>(AuthenticationConstructor: Constructor<T>) => {
	AuthenticationHelper.addAuthenticationComponent(AuthenticationConstructor)
}

export const noAuthentication = () => <T extends AuthenticationComponent>(AuthenticationConstructor: Constructor<T>) => {
	AuthenticationHelper.addNoAuthenticationComponent(AuthenticationConstructor)
}

export class AuthenticationHelper {
	private static readonly authenticationComponents = new Set<Constructor<AuthenticationComponent>>()
	private static readonly noAuthenticationComponents = new Set<Constructor<AuthenticationComponent>>()
	private static globalAuthentication = false

	private static _AuthenticatorConstructor?: Constructor<AuthenticatorComponent>
	static get AuthenticatorConstructor() { return this._AuthenticatorConstructor }
	static set AuthenticatorConstructor(value) {
		AuthenticationHelper._AuthenticatorConstructor = value
		this.authenticator = value ? new value() : undefined
	}

	private static authenticator?: AuthenticatorComponent

	static hasAuthenticator() {
		return !!AuthenticationHelper.AuthenticatorConstructor
	}

	static addAuthenticationComponent(component: Constructor<AuthenticationComponent>) {
		if (component.prototype instanceof Application) {
			AuthenticationHelper.globalAuthentication = true
		} else {
			this.authenticationComponents.add(component)
		}
	}

	static addNoAuthenticationComponent(component: Constructor<AuthenticationComponent>) {
		this.noAuthenticationComponents.add(component)
	}

	static async authenticateGlobally() {
		if (this.globalAuthentication) {
			await this.authenticate()
			await ApplicationProviderHelper.provideAfterGlobalAuthenticationProviders()
		}
	}

	static async authenticateComponent(component: AuthenticationComponent) {
		const AuthenticationConstructor = component.constructor as Constructor<AuthenticationComponent>

		const shallAuthenticate = this.globalAuthentication === false
			&& this.noAuthenticationComponents.has(AuthenticationConstructor) === false
			&& this.authenticationComponents.has(AuthenticationConstructor)

		if (shallAuthenticate) {
			await this.authenticate()
		}
	}

	private static async authenticate() {
		await this.authenticator?.confirm()
	}

	static async unauthenticate() {
		await this.authenticator?.unauthenticate()
	}
}