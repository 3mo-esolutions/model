import { authenticator, component, DialogAuthenticator as DialogAuthenticatorBase } from '@3mo/model/library'

@authenticator
@component('sample-dialog-authenticator')
export class DialogAuthenticator extends DialogAuthenticatorBase {
	protected authenticateProcess() {
		return Promise.resolve({
			id: 1,
			name: 'Max Mustermann',
			company: '3MO',
			email: 'max@3mo.de',
		})
	}

	protected unauthenticateProcess() {
		return Promise.resolve()
	}

	protected checkAuthenticationProcess() {
		return Promise.resolve(true)
	}

	protected resetPasswordProcess() {
		return Promise.reject('Password cannot be reset')
	}
}