import { component, DialogAuthenticator as DialogAuthenticatorBase } from '@3mo/model'

@component('photos-dialog-authenticator')
export class DialogAuthenticator extends DialogAuthenticatorBase {
	protected authenticateProcess() {
		return Promise.resolve({
			id: 1,
			name: 'Full Name',
			company: '3MO',
			email: 'name@3mo.de',
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