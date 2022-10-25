import { html, component } from '../../library'
import { DialogDeletion } from '..'
import { PagePreferences, PageSettings } from '.'
import { AuthenticationHelper, DialogAuthenticator, route, routeHost } from '../../shell'

@component('mo-page-preferences-security')
@route('/preferences/security')
@routeHost(PagePreferences)
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
						?selected=${DialogAuthenticator.shallRememberCredentials.value}
						@selectionChange=${(e: CustomEvent<boolean>) => DialogAuthenticator.shallRememberCredentials.value = e.detail}
					>Passwort merken & eingeloggt bleiben</mo-list-item-checkbox>

					<mo-list-item hidden>2-Faktor Authentifizierung</mo-list-item>

					<mo-list-item
						?hidden=${!AuthenticationHelper.hasAuthenticator()}
						@click=${() => AuthenticationHelper['authenticator']?.resetPassword()}
					>Passwort ändern</mo-list-item>
				</mo-flex>
			</mo-page>
		`
	}
}