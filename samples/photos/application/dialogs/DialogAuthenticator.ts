import { BusinessSuiteDialogAuthenticator, component } from '@3mo/model'

@component('photos-dialog-authenticator')
export class DialogAuthenticator extends BusinessSuiteDialogAuthenticator {
	private static readonly user = {
		id: 1,
		name: 'Full Name',
		email: 'name@3mo.de',
	}

	protected authenticateAccount() {
		return Promise.resolve(DialogAuthenticator.user)
	}

	protected unauthenticateAccount() {
		return Promise.resolve()
	}

	protected getAuthenticatedAccount() {
		return Promise.resolve(DialogAuthenticator.user)
	}

	protected override requestPasswordReset() {
		return Promise.resolve()
	}
}