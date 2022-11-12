import { component, DialogAuthenticator as DialogAuthenticatorBase } from '@3mo/model'

@component('photos-dialog-authenticator')
export class DialogAuthenticator extends DialogAuthenticatorBase {
	protected requestAuthentication() {
		return Promise.resolve({
			id: 1,
			name: 'Full Name',
			company: '3MO',
			email: 'name@3mo.de',
		})
	}

	protected requestUnauthentication() {
		return Promise.resolve()
	}

	protected isAuthenticatedServerSide() {
		return Promise.resolve(true)
	}

	protected requestPasswordReset() {
		return Promise.reject('Password cannot be reset')
	}
}