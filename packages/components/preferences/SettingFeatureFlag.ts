import { component, html, property, render } from '@a11d/lit'
import { FeatureFlagHelper, FeatureFlag } from '../../utilities'
import { ListItemCheckbox } from '../material'

@component('mo-setting-feature-flag')
export class SettingFeatureFlag extends ListItemCheckbox {
	@property({
		type: Object,
		updated(this: SettingFeatureFlag) {
			this.selected = FeatureFlagHelper.isActivated(this.featureFlag.key)
			this.disabled = FeatureFlagHelper.isMandatory(this.featureFlag.key)
			const content = html`
				${this.featureFlag.title ?? ''}
				<span slot='secondary'>wird ${new MoDate(this.featureFlag.mandatoryFrom).since(new MoDate)} aktiviert</span>
			`
			render(content, this)
		}
	}) featureFlag!: FeatureFlag

	constructor() {
		super()
		this.icon = 'fiber_new'
		this.twoline = true
		this.selectionChange.subscribe(isSelected => {
			if (isSelected) {
				FeatureFlagHelper.activate(this.featureFlag.key)
			} else {
				FeatureFlagHelper.deactivate(this.featureFlag.key)
			}
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-setting-feature-flag': SettingFeatureFlag
	}
}