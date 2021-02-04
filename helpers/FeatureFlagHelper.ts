import { LocalStorageEntry } from '.'

type FeatureFlag = string

export type FeatureFlagDefinition = {
	key: string
	title?: string
	mandatoryFrom: Date
}

export class FeatureFlagHelper {
	private static readonly Container = new Array<FeatureFlagDefinition>()
	private static readonly ActivatedContainer = new LocalStorageEntry('MoDeL.FeatureFlags.Activated', new Array<FeatureFlag>())

	static get flags() {
		return FeatureFlagHelper.Container as ReadonlyArray<FeatureFlagDefinition>
	}

	static define(...featureFlagDefinitions: Array<FeatureFlagDefinition>) {
		FeatureFlagHelper.Container.push(...featureFlagDefinitions)
	}

	static isActivated(...featureFlags: Array<FeatureFlag>) {
		return featureFlags.every(p => FeatureFlagHelper.ActivatedContainer.value.includes(p))
	}

	static activate(...featureFlags: Array<FeatureFlag>) {
		FeatureFlagHelper.ActivatedContainer.value = [
			...featureFlags,
			...FeatureFlagHelper.ActivatedContainer.value,
		]
	}

	static deactivate(...featureFlags: Array<FeatureFlag>) {
		FeatureFlagHelper.ActivatedContainer.value =
			FeatureFlagHelper.ActivatedContainer.value.filter(p => featureFlags.includes(p) === false)
	}
}