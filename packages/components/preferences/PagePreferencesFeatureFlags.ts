import { html, component, style } from '@a11d/lit'
import { FeatureFlagHelper } from '../../utilities'
import { route } from '@a11d/lit-application'
import { PagePreferences, PageSettings } from '.'

@component('mo-page-preferences-feature-flags')
@route(PagePreferences, '/preferences/feature-flags')
export class PagePreferencesFeatureFlags extends PageSettings {
	protected override get template() {
		return html`
			<mo-page heading='Feature-Flags' fullHeight>
				<mo-flex gap='var(--mo-thickness-m)'>
					${FeatureFlagHelper.flags.length === 0 ? this.noFlagsTemplate : FeatureFlagHelper.flags.map(ff => html`
						<mo-setting-feature-flag .featureFlag=${ff}></mo-setting-feature-flag>
					`)}
				</mo-flex>
			</mo-page>
		`
	}

	private get noFlagsTemplate() {
		return html`
			<mo-flex gap='var(--mo-thickness-l)' ${style({ userSelect: 'none', margin: 'auto', textAlign: 'center', color: 'var(--mo-color-gray)' })}>
				<mo-icon icon='fiber_new' ${style({ fontSize: '48px' })}></mo-icon>
				<mo-heading ${style({ fontWeight: '600' })}>Keine Feature-Flags verfügbar</mo-heading>
			</mo-flex>
		`
	}
}