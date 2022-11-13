import { html, nothing, state } from '@a11d/lit'
import { DialogAuthenticator as DialogAuthenticatorBase } from '@a11d/lit-application-authentication'
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

export type User = {
	id: number
	name: string
	email: string
}

export abstract class BusinessSuiteDialogAuthenticator extends DialogAuthenticatorBase<User> {
	@state() primaryButtonText = _('Login')

	protected override get template() {
		return html`
			<mo-dialog blocking primaryOnEnter ${style({ '--mdc-dialog-scrim-color': 'var(--mo-color-background)' })}>
				<mo-loading-button slot='primaryAction' type='raised'>${this.primaryButtonText}</mo-loading-button>
				${this.additionalTemplate}
				<mo-flex alignItems='center' gap='40px'>
					${this.logoTemplate}
					${this.applicationInfoTemplate}
					${this.contentTemplate}
				</mo-flex>
			</mo-dialog>
		`
	}

	protected get additionalTemplate() {
		return nothing
	}

	protected get applicationInfoTemplate() {
		return !manifest ? nothing : html`
			<mo-heading typography='subheading1' ${style({ color: 'var(--mo-color-gray)' })}>
				${manifest.name} ${!manifest.version ? nothing : html`v${manifest.version}`}
			</mo-heading>
		`
	}

	protected get logoTemplate() {
		return html`
			<mo-application-logo ${style({ height: '100px', maxWidth: '75%', padding: '15px 0 0 0' })}></mo-application-logo>
		`
	}

	protected get contentTemplate() {
		return html`
			<mo-flex gap='var(--mo-thickness-l)' ${style({ height: '*', width: '100%', paddingBottom: '25px' })}>
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

				<mo-flex direction='horizontal' justifyContent='space-between' alignItems='center' wrap='wrap-reverse'>
					<mo-checkbox
						label=${_('Remember Password')}
						?checked=${this.shallRememberPassword}
						@change=${(e: CustomEvent<CheckboxValue>) => this.shallRememberPassword = e.detail === 'checked'}
					></mo-checkbox>

					<mo-anchor ${style({ fontSize: 'small' })} @click=${() => this.resetPassword()}>${_('Reset Password')}</mo-anchor>
				</mo-flex>
			</mo-flex>
		`
	}
}