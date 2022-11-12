import { LocalStorageEntry } from '@a11d/lit-application'

type FeatureFlagKey = string

export type FeatureFlag = {
	key: string
	mandatoryFrom: Date
	title?: string
	changedCallback?: (active: boolean) => void
}

export class FeatureFlagHelper {
	private static readonly container = new Set<FeatureFlag>()
	private static readonly activatedContainer = new LocalStorageEntry('MoDeL.FeatureFlags.Activated', new Array<FeatureFlagKey>())

	static get flags() {
		return [...FeatureFlagHelper.container].filter(featureFlag => this.isMandatory(featureFlag.key) === false) as ReadonlyArray<FeatureFlag>
	}

	static register(...featureFlags: Array<FeatureFlag>) {
		for (const ff of featureFlags) {
			this.container.add(ff)
		}
	}

	static isActivated(...featureFlagKeys: Array<FeatureFlagKey>) {
		return featureFlagKeys.every(key => this.activatedContainer.value.includes(key) || this.isMandatory(key))
	}

	static isMandatory(key: FeatureFlagKey) {
		const featureFlag = [...this.container].find(p => p.key === key)
		return !featureFlag ? false : featureFlag.mandatoryFrom.getTime() <= new Date().getTime()
	}

	static activate(...featureFlagKeys: Array<FeatureFlagKey>) {
		this.activatedContainer.value = [...new Set([...this.activatedContainer.value, ...featureFlagKeys])]
		this.callChangedCallback(true, ...featureFlagKeys)
	}

	static deactivate(...featureFlagKeys: Array<FeatureFlagKey>) {
		this.activatedContainer.value = [...new Set(this.activatedContainer.value.filter(key => this.isMandatory(key) || featureFlagKeys.includes(key) === false))]
		this.callChangedCallback(false, ...featureFlagKeys)
	}

	private static callChangedCallback(active: boolean, ...featureFlagKeys: Array<FeatureFlagKey>) {
		[...this.container]
			.filter(ff => featureFlagKeys.includes(ff.key))
			.forEach(featureFlag => featureFlag.changedCallback?.(active))
	}
}