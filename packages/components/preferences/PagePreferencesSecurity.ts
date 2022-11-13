import { html, component, nothing } from '@a11d/lit'
import { DialogDeletion } from '..'
import { PagePreferences, PageSettings } from '.'
import { route } from '@a11d/lit-application'
import { BusinessSuiteDialogAuthenticator } from '../../shell'
import { Authentication } from '@a11d/lit-application-authentication'

@component('mo-page-preferences-security')
@route(PagePreferences, '/preferences/security')
export class PagePreferencesSecurity extends PageSettings {
	protected override get template() {
		return html`
			<mo-page heading='Sicherheit'>
				<mo-flex gap='var(--mo-thickness-m)'>
					<mo-list-item-checkbox
						?selected=${DialogDeletion.deletionConfirmation.value}
						@selectionChange=${(e: CustomEvent<boolean>) => DialogDeletion.deletionConfirmation.value = e.detail}
					>Vor dem Löschen bestätigen</mo-list-item-checkbox>

					<mo-list-item-checkbox
						?selected=${BusinessSuiteDialogAuthenticator.shallRememberStorage.value}
						@selectionChange=${(e: CustomEvent<boolean>) => BusinessSuiteDialogAuthenticator.shallRememberStorage.value = e.detail}
					>Passwort merken & eingeloggt bleiben</mo-list-item-checkbox>

					${!Authentication.hasAuthenticator() ? nothing : html`
						<mo-list-item @click=${() => Authentication['authenticator']?.resetPassword()}>Passwort ändern</mo-list-item>
					`}
				</mo-flex>
			</mo-page>
		`
	}
}