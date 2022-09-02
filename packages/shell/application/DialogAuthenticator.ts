import { html, css, state, nothing } from '../../library'
import { DialogComponent } from '../dialog'
import { LocalStorageEntry } from '../../utilities'
import { NotificationHost, User } from '..'
import { Localizer, style } from '../..'

Localizer.register(LanguageCode.German, {
	'Authenticated successfully': 'Erfolgreich authentifiziert',
	'Incorrect Credentials': 'Ungültige Anmeldeinformationen',
	'Password reset instructions have been sent to your email address': 'Anweisungen zum Zurücksetzen des Passworts wurden an Ihre E-Mail-Adresse gesendet',
	'Password could not be reset': 'Passwort konnte nicht zurückgesetzt werden',
	'Something went wrong. Try again.': 'Etwas ist schief gelaufen. Versuche nochmal.',
	'Username': 'Benutzer',
	'Password': 'Passwort',
	'Remember Password': 'Passwort merken',
	'Reset Password': 'Passwort zurücksetzen',
	'Welcome': 'Willkommen',
	'Login': 'Anmelden'
})

export abstract class DialogAuthenticator extends DialogComponent {
	static readonly shallRemember = new LocalStorageEntry('MoDeL.Authentication.ShallRemember', false)
	static readonly authenticatedUser = new LocalStorageEntry<User | undefined>('MoDeL.Authentication.User', undefined)
	private static readonly password = new LocalStorageEntry<string | undefined>('MoDeL.Authentication.Password', undefined)
	private static readonly username = new LocalStorageEntry<string | undefined>('MoDeL.Authentication.Username', undefined)

	@state() shallRememberPassword = DialogAuthenticator.shallRemember.value
	@state() username = DialogAuthenticator.shallRemember.value ? DialogAuthenticator.username.value ?? '' : ''
	@state() password = DialogAuthenticator.shallRemember.value ? DialogAuthenticator.password.value ?? '' : ''
	@state() primaryButtonText = _('Login')

	private preventNextAutomaticAuthentication = false

	protected abstract authenticateProcess(): Promise<User>
	protected abstract unauthenticateProcess(): Promise<void>
	protected abstract checkAuthenticationProcess(): Promise<boolean>
	protected abstract resetPasswordProcess(): Promise<void>

	async isAuthenticated() {
		const isAuthenticatedServerSide = await this.checkAuthenticationProcess()
		const isAuthenticatedClientSide = DialogAuthenticator.authenticatedUser.value !== undefined
		return isAuthenticatedServerSide && isAuthenticatedClientSide
	}

	async authenticate() {
		try {
			const user = await this.authenticateProcess()
			DialogAuthenticator.authenticatedUser.value = user
			const isAuthenticated = await this.isAuthenticated()
			if (isAuthenticated === false) {
				throw new Error(_('Something went wrong. Try again.'))
			}
			NotificationHost.instance.notifySuccess(_('Authenticated successfully'))
		} catch (error: any) {
			throw new Error(error.message ?? _('Incorrect Credentials'))
		}
	}

	async unauthenticate() {
		try {
			await this.unauthenticateProcess()
		} finally {
			NotificationHost.instance.notifySuccess(_('Unauthenticated successfully'))
			DialogAuthenticator.authenticatedUser.value = undefined
			this.preventNextAutomaticAuthentication = true
			this.confirm()
		}
	}

	async resetPassword() {
		try {
			await this.resetPasswordProcess()
			NotificationHost.instance.notifyInfo(_('Password reset instructions have been sent to your email address'))
		} catch (error: any) {
			NotificationHost.instance.notifyError(error.message ?? _('Password could not be reset'))
			throw error
		}
	}

	override async confirm(...args: Parameters<DialogComponent['confirm']>) {
		const defaultToSuper = async () => {
			await super.confirm(...args)
			this.requestApplicationUpdate()
		}

		if (this.preventNextAutomaticAuthentication === true) {
			this.preventNextAutomaticAuthentication = false
			return defaultToSuper()
		}

		const isAuthenticated = await this.isAuthenticated()

		if (isAuthenticated) {
			return
		}

		const shouldHaveRemembered = DialogAuthenticator.shallRemember.value

		if (!shouldHaveRemembered) {
			return defaultToSuper()
		}

		try {
			await this.authenticate()
			return this.requestApplicationUpdate()
		} catch (error) {
			return defaultToSuper()
		}
	}

	protected requestApplicationUpdate() {
		MoDeL.application.requestUpdate()
		MoDeL.application.pageHost.currentPage?.requestUpdate()
	}

	static override get styles() {
		return css`
			mo-dialog {
				--mdc-dialog-scrim-color: var(--mo-color-background)
			}

			a {
				font-size: dense;
				opacity: 0.85;
				cursor: pointer;
			}

			a:hover {
				color: var(--mo-color-accent);
			}

			h2 {
				font-weight: 500;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-dialog blocking primaryOnEnter>
				<mo-loading-button slot='primaryAction' type='raised'>${this.primaryButtonText}</mo-loading-button>
				${this.additionalTemplate}
				<mo-flex alignItems='center' ${style({ minWidth: '350px' })}>
					${this.headerTemplate}
					<mo-flex alignItems='stretch' justifyContent='center' gap='var(--mo-thickness-m)' ${style({ height: '*', width: '100%', minHeight: '250px' })}>
						${this.contentTemplate}
					</mo-flex>
				</mo-flex>
			</mo-dialog>
		`
	}

	protected get additionalTemplate() {
		return nothing
	}

	protected get headerTemplate() {
		return html`
			<mo-flex ${style({ height: '100px' })} alignItems='center' gap='10px'>
				${this.logoTemplate}
				<mo-heading typography='heading3'>${Manifest.short_name || _('Welcome')}</mo-heading>
			</mo-flex>
		`
	}

	protected get logoTemplate() {
		return html`
			<mo-application-logo ${style({ height: '60px' })}></mo-application-logo>
		`
	}

	protected get contentTemplate() {
		return html`
			<mo-field-text data-focus
				label=${_('Username')}
				.value=${this.username}
				@input=${(e: CustomEvent<string>) => this.username = e.detail}
			></mo-field-text>

			<mo-field-password
				label=${_('Password')}
				.value=${this.password}
				@input=${(e: CustomEvent<string>) => this.password = e.detail}
			></mo-field-password>

			<mo-flex direction='horizontal' justifyContent='space-between' alignItems='center'>
				<mo-checkbox
					label=${_('Remember Password')}
					?checked=${this.shallRememberPassword}
					@change=${(e: CustomEvent<CheckboxValue>) => this.shallRememberPassword = e.detail === 'checked'}
				></mo-checkbox>

				<a @click=${() => this.resetPassword()}>${_('Reset Password')}</a>
			</mo-flex>
		`
	}

	protected override async primaryAction() {
		DialogAuthenticator.shallRemember.value = this.shallRememberPassword
		if (DialogAuthenticator.shallRemember.value) {
			DialogAuthenticator.username.value = this.username
			DialogAuthenticator.password.value = this.password
		}
		await this.authenticate()
	}
}