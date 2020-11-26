import { html, property, Snackbar } from '..'
import { DialogComponent } from '../dialog'
import { Checkbox, TextField } from '../../components'
import { StorageContainer } from '../../helpers'
import { KeyboardKey, User } from '../../types'

export default abstract class DialogAuthenticator extends DialogComponent {
	get isAuthenticated() { return StorageContainer.Authentication.isAuthenticated.value }
	set isAuthenticated(value) { StorageContainer.Authentication.isAuthenticated.value = value }

	async quickAuthenticate() {
		this.isAuthenticated = await this.checkAuthenticationProcess()

		if (this.isAuthenticated)
			return

		if (StorageContainer.Authentication.ShallRemember.value) {
			await this.authenticate()
			return
		}

		throw new Error('Cannot authenticate automatically')
	}

	async unauthenticate() {
		try {
			await this.unauthenticateProcess()
		} finally {
			Snackbar.show('Unauthenticated successfully')
			this.isAuthenticated = false
			StorageContainer.Authentication.User.value = undefined
			MDC.applicationHost.authenticator?.open()
		}
	}

	protected abstract authenticateProcess(): Promise<User>
	protected abstract unauthenticateProcess(): Promise<void>
	protected abstract checkAuthenticationProcess(): Promise<boolean>
	protected abstract resetPasswordProcess(): Promise<void>

	protected initialized() {
		super.initialized()

		window.addEventListener('keypress', async event => {
			if (event.key === KeyboardKey.Enter && this.isAuthenticated === false) {
				await this.dialog['handlePrimaryButtonClick']()
			}
		})
	}

	@property({ type: Boolean }) shallRememberPassword = StorageContainer.Authentication.ShallRemember.value ?? false
	@property() username = StorageContainer.Authentication.ShallRemember.value ? StorageContainer.Authentication.Username.value ?? '' : ''
	@property() password = StorageContainer.Authentication.ShallRemember.value ? StorageContainer.Authentication.Password.value ?? '' : ''

	protected render() {
		return html`
			<style>
				a {
					font-size: small;
					opacity: 0.85;
					cursor: pointer;
				}
			</style>
			<mdc-dialog actionsJustifyContent='center' isBlocking .primaryButtonClicked=${this.authenticate.bind(this)} style='--mdc-dialog-scrim-color: var(--mdc-color-background)'>
				<mdc-button slot='primaryAction' justifyContent='center' raised>Login</mdc-button>
				<mdc-flex alignItems='center' minWidth='350px'>
					<mdc-flex height='100px' alignItems='center' gap='10px'>
						<mdc-logo height='60px' color='var(--mdc-accent)'></mdc-logo>
						<h2>${MDC.applicationHost.appTitle ?? 'Welcome'}</h2>
					</mdc-flex>
					<mdc-flex height='*' width='100%' alignItems='stretch' justifyContent='center' gap='var(--mdc-thickness-d)'>
						<mdc-text-field label='Username'
							@input=${(e: CustomEvent<undefined, TextField>) => this.username = e.source.value}
							.value=${this.username}></mdc-text-field>

						<mdc-text-field label='Password' type='password'
							@input=${(e: CustomEvent<undefined, TextField>) => this.password = e.source.value}
							.value=${this.password}></mdc-text-field>

						<mdc-flex direction='horizontal' justifyContent='space-between' alignItems='center'>
							<mdc-checkbox @change=${(e: CustomEvent<undefined, Checkbox>) => this.shallRememberPassword = e.source.checked}>Remember Password</mdc-checkbox>
							<a @click=${() => this.resetPassword()}>Reset Password</a>
						</mdc-flex>
					</mdc-flex>
				</mdc-flex>
			</mdc-dialog>
		`
	}

	protected async authenticate() {
		StorageContainer.Authentication.ShallRemember.value = this.shallRememberPassword
		if (StorageContainer.Authentication.ShallRemember.value) {
			StorageContainer.Authentication.Username.value = this.username
			StorageContainer.Authentication.Password.value = this.password
		}

		try {
			const user = await this.authenticateProcess()
			this.isAuthenticated = await this.checkAuthenticationProcess()
			if (this.isAuthenticated === false) {
				throw new Error('Something went wrong.\nTry again')
			}
			MDC.applicationHost.authenticatedUser = user
			StorageContainer.Authentication.User.value = user
			Snackbar.show('Authenticated successfully')
		} catch (error) {
			throw new Error('Incorrect Credentials')
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