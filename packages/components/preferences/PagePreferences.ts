import { html, component, style, nothing } from '../../library'
import { DialogReleaseNotes, PagePreferencesFeatureFlags, PagePreferencesSecurity, PagePreferencesUserInterface } from '..'
import { PageSettingsHost } from '.'
import { route } from '../../shell'

@route('/preferences')
@component('mo-page-preferences')
export class PagePreferences extends PageSettingsHost {
	protected get heading() {
		return 'Benutzereinstellungen'
	}

	protected get settingsTemplate() {
		return html`
			<mo-card ${style({ height: '100%', '--mo-card-body-padding': '0px' })}>
				<mo-flex ${style({ height: '100%' })} gap='var(--mo-thickness-xl)' justifyContent='space-between'>
					<mo-list activatable>
						<mo-navigation-list-item icon='security' .component=${new PagePreferencesSecurity}>Sicherheit</mo-navigation-list-item>
						<mo-navigation-list-item icon='palette' .component=${new PagePreferencesUserInterface}>Design & Aussehen</mo-navigation-list-item>
						<mo-navigation-list-item icon='fiber_new' .component=${new PagePreferencesFeatureFlags}>Feature-Flags</mo-navigation-list-item>
					</mo-list>

					${!Manifest ? nothing : html`
						<mo-flex direction='horizontal' alignItems='center' justifyContent='center' ${style({ color: 'var(--mo-color-gray)', padding: 'var(--mo-thickness-l)' })}>
							<mo-heading typography='heading6'>${Manifest.name} v${Manifest.version}</mo-heading>
							<mo-icon-button dense icon='info' ?hidden=${!Changelog} ${style({ color: 'var(--mo-color-accent)' })} @click=${() => new DialogReleaseNotes().confirm()}></mo-icon-button>
						</mo-flex>
					`}
				</mo-flex>
			</mo-card>
		`
	}
}