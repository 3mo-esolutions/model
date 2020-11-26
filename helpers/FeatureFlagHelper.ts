import { StorageContainer } from '.'

export default new class PermissionHelper {
	isActivated(...featureFlags: Array<keyof MDC.FeatureFlags>) {
		return featureFlags.every(p => StorageContainer.FeatureFlags.value.includes(p))
	}

	activate(...featureFlags: Array<keyof MDC.FeatureFlags>) {
		StorageContainer.FeatureFlags.value = [
			...featureFlags,
			...StorageContainer.FeatureFlags.value,
		]
	}

	deactivate(...featureFlags: Array<keyof MDC.FeatureFlags>) {
		StorageContainer.FeatureFlags.value =
			StorageContainer.FeatureFlags.value.filter(p => featureFlags.includes(p) === false)
	}
}