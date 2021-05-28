import { html, property, Snackbar } from '..'
import { DialogComponent } from '../dialog'
import { LocalStorageEntry } from '../../helpers'
import { User } from '../../types'

export abstract class DialogAuthenticator extends DialogComponent {
	static readonly authenticatedUser = new LocalStorageEntry<User | undefined>('MoDeL.Authentication.User', undefined)
	private static readonly password = new LocalStorageEntry<string | undefined>('MoDeL.Authentication.Password', undefined)
	private static readonly shallRemember = new LocalStorageEntry('MoDeL.Authentication.ShallRemember', false)
	private static readonly username = new LocalStorageEntry<string | undefined>('MoDeL.Authentication.Username', undefined)

	@property({ type: Boolean }) shallRememberPassword = DialogAuthenticator.shallRemember.value
	@property() username = DialogAuthenticator.shallRemember.value ? DialogAuthenticator.username.value ?? '' : ''
	@property() password = DialogAuthenticator.shallRemember.value ? DialogAuthenticator.password.value ?? '' : ''

	protected abstract authenticateProcess(): Promise<User>
	protected abstract unauthenticateProcess(): Promise<void>
	protected abstract checkAuthenticationProcess(): Promise<boolean>
	protected abstract resetPasswordProcess(): Promise<void>

	async unauthenticate() {
		try {
			await this.unauthenticateProcess()
		} finally {
			Snackbar.show('Unauthenticated successfully')
			DialogAuthenticator.authenticatedUser.value = undefined
			MoDeL.application.authenticator?.open()
		}
	}

	override async confirm() {
		const isAuthenticated = await this.isAuthenticated()
		if (isAuthenticated !== true) {
			await super.confirm()
		}
	}

	protected override async initialized() {
		window.addEventListener('keypress', async event => {
			const isAuthenticated = DialogAuthenticator.authenticatedUser.value !== undefined
			if (event.key === KeyboardKey.Enter && isAuthenticated === false) {
				await this.dialog?.['handlePrimaryButtonClick']()
			}
		})

		if (DialogAuthenticator.shallRemember.value) {
			await this.authenticate()
			this.close()
		}
	}

	protected override render = () => html`
		<style>
			mo-dialog {
				--mdc-dialog-scrim-color: var(--mo-color-background)
			}

			mo-dialog::part(footer) {
				justify-content: center;
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
		<mo-dialog blocking primaryOnEnter .primaryButtonClicked=${this.authenticate}>
			<mo-button slot='primaryAction' justifyContent='center' raised>Login</mo-button>
			<mo-flex alignItems='center' minWidth='350px'>
				<mo-flex height='100px' alignItems='center' gap='10px'>
					<mo-logo height='60px' color='var(--mo-accent)'></mo-logo>
					<h2>${Manifest.short_name || 'Welcome'}</h2>
				</mo-flex>
				<mo-flex height='*' width='100%' minHeight='250px' alignItems='stretch' justifyContent='center' gap='var(--mo-thickness-m)'>
					<mo-field-text label='Username'
						.value=${this.username}
						@input=${(e: CustomEvent<string>) => this.username = e.detail}
					></mo-field-text>

					<mo-field-password label='Password'
						.value=${this.password}
						@input=${(e: CustomEvent<string>) => this.password = e.detail}
					></mo-field-password>

					<mo-flex direction='horizontal' justifyContent='space-between' alignItems='center'>
						<mo-checkbox @change=${(e: CustomEvent<CheckboxValue>) => this.shallRememberPassword = e.detail === 'checked'}>Remember Password</mo-checkbox>
						<a @click=${() => this.resetPassword()}>Reset Password</a>
					</mo-flex>
				</mo-flex>
			</mo-flex>
		</mo-dialog>
	`

	protected async isAuthenticated() {
		const isAuthenticatedServerSide = await this.checkAuthenticationProcess()
		const isAuthenticatedClientSide = DialogAuthenticator.authenticatedUser.value !== undefined
		return isAuthenticatedServerSide && isAuthenticatedClientSide
	}

	protected authenticate = async () => {
		DialogAuthenticator.shallRemember.value = this.shallRememberPassword
		if (DialogAuthenticator.shallRemember.value) {
			DialogAuthenticator.username.value = this.username
			DialogAuthenticator.password.value = this.password
		}

		try {
			const user = await this.authenticateProcess()
			DialogAuthenticator.authenticatedUser.value = user
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