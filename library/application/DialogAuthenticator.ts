import { html, property, Snackbar } from '..'
import { DialogComponent } from '../dialog'
import { Checkbox, TextField } from '../../components'
import { LocalStorageEntry } from '../../helpers'
import { KeyboardKey, User } from '../../types'

export abstract class DialogAuthenticator extends DialogComponent {
	static readonly Password = new LocalStorageEntry<string | undefined>('MoDeL.Authentication.Password', undefined)
	static readonly ShallRemember = new LocalStorageEntry('MoDeL.Authentication.ShallRemember', false)
	static readonly Username = new LocalStorageEntry<string | undefined>('MoDeL.Authentication.Username', undefined)
	static readonly AuthenticatedUser = new LocalStorageEntry<User | undefined>('MoDeL.AuthenticatedUser', undefined)

	async unauthenticate() {
		try {
			await this.unauthenticateProcess()
		} finally {
			Snackbar.show('Unauthenticated successfully')
			DialogAuthenticator.AuthenticatedUser.value = undefined
			MoDeL.application.authenticator?.open()
		}
	}

	async confirm() {
		const isAuthenticated = await this.isAuthenticated()
		if (isAuthenticated !== true) {
			await super.confirm()
		}
	}

	protected abstract authenticateProcess(): Promise<User>
	protected abstract unauthenticateProcess(): Promise<void>
	protected abstract checkAuthenticationProcess(): Promise<boolean>
	protected abstract resetPasswordProcess(): Promise<void>

	protected async initialized() {
		window.addEventListener('keypress', async event => {
			const isAuthenticated = DialogAuthenticator.AuthenticatedUser !== undefined
			if (event.key === KeyboardKey.Enter && isAuthenticated === false) {
				await this.dialog?.['handlePrimaryButtonClick']()
			}
		})

		if (DialogAuthenticator.ShallRemember.value) {
			await this.authenticate()
			this.close()
		}
	}

	@property({ type: Boolean }) shallRememberPassword = DialogAuthenticator.ShallRemember.value ?? false
	@property() username = DialogAuthenticator.ShallRemember.value ? DialogAuthenticator.Username.value ?? '' : ''
	@property() password = DialogAuthenticator.ShallRemember.value ? DialogAuthenticator.Password.value ?? '' : ''

	protected render = () => html`
		<style>
			mo-dialog {
				--mdc-dialog-scrim-color: var(--mo-color-background)
			}

			a {
				font-size: small;
				opacity: 0.85;
				cursor: pointer;
			}

			a:hover {
				color: var(--mo-accent);
			}

			h2 {
				font-weight: 500;
			}
		</style>
		<mo-dialog actionsJustifyContent='center' isBlocking primaryOnEnter .primaryButtonClicked=${this.authenticate.bind(this)}>
			<mo-button slot='primaryAction' justifyContent='center' raised>Login</mo-button>
			<mo-flex alignItems='center' minWidth='350px'>
				<mo-flex height='100px' alignItems='center' gap='10px'>
					<mo-logo height='60px' color='var(--mo-accent)'></mo-logo>
					<h2>${Manifest.short_name ?? 'Welcome'}</h2>
				</mo-flex>
				<mo-flex height='*' width='100%' minHeight='250px' alignItems='stretch' justifyContent='center' gap='var(--mo-thickness-m)'>
					<mo-text-field label='Username'
						@input=${(e: CustomEvent<undefined, TextField>) => this.username = e.source.value}
						.value=${this.username}></mo-text-field>

					<mo-text-field label='Password' type='password'
						@input=${(e: CustomEvent<undefined, TextField>) => this.password = e.source.value}
						.value=${this.password}></mo-text-field>

					<mo-flex direction='horizontal' justifyContent='space-between' alignItems='center'>
						<mo-checkbox @change=${(e: CustomEvent<undefined, Checkbox>) => this.shallRememberPassword = e.source.checked}>Remember Password</mo-checkbox>
						<a @click=${() => this.resetPassword()}>Reset Password</a>
					</mo-flex>
				</mo-flex>
			</mo-flex>
		</mo-dialog>
	`

	protected async isAuthenticated() {
		const isAuthenticatedServerSide = await this.checkAuthenticationProcess()
		const isAuthenticatedClientSide = DialogAuthenticator.AuthenticatedUser.value !== undefined
		return isAuthenticatedServerSide && isAuthenticatedClientSide
	}

	protected async authenticate() {
		DialogAuthenticator.ShallRemember.value = this.shallRememberPassword
		if (DialogAuthenticator.ShallRemember.value) {
			DialogAuthenticator.Username.value = this.username
			DialogAuthenticator.Password.value = this.password
		}

		try {
			const user = await this.authenticateProcess()
			DialogAuthenticator.AuthenticatedUser.value = user
			const isAuthenticated = await this.isAuthenticated()
			if (isAuthenticated === false) {
				throw new Error('Something went wrong.\nTry again.')
			}
			MoDeL.application.authenticatedUser = user
			Snackbar.show('Authenticated successfully')
		} catch (error) {
			throw new Error(error.message ?? 'Incorrect Credentials')
		}
	}

	protected async resetPassword() {
		try {
			await this.resetPasswordProcess()
			Snackbar.show('Password reset instructions have been sent to your email address')
		} catch (error) {
			Snackbar.show(error.message ?? 'Password could not be reset')
			throw error
		}
	}
}