import { html, component, style, nothing } from '@a11d/lit'
import { DialogReleaseNotes, PagePreferencesFeatureFlags, PagePreferencesSecurity, PagePreferencesUserInterface } from '..'
import { PageSettingsHost } from '.'
import { route, RouterController } from '@a11d/lit-application'

@route('/preferences')
@component('mo-page-preferences')
export class PagePreferences extends PageSettingsHost {
	readonly router = new RouterController(this,
		[
			{ path: '/preferences/security', render: () => new PagePreferencesSecurity() },
			{ path: '/preferences/user-interface', render: () => new PagePreferencesUserInterface() },
			{ path: '/preferences/feature-flags', render: () => new PagePreferencesFeatureFlags() },
		]
	)

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

					${!manifest ? nothing : html`
						<mo-flex direction='horizontal' alignItems='center' justifyContent='center' ${style({ color: 'var(--mo-color-gray)', padding: 'var(--mo-thickness-l)' })}>
							<mo-heading typography='heading6'>${manifest.name} v${manifest.version}</mo-heading>
							${!Changelog ? nothing : html`<mo-icon-button dense icon='info' ${style({ color: 'var(--mo-color-accent)' })} @click=${() => new DialogReleaseNotes().confirm()}></mo-icon-button>`}
						</mo-flex>
					`}
				</mo-flex>
			</mo-card>
		`
	}
}