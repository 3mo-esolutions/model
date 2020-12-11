import { StorageContainer } from '.'

export default new class PermissionHelper {
	isActivated(...featureFlags: Array<keyof MoDeL.FeatureFlags>) {
		return featureFlags.every(p => StorageContainer.FeatureFlags.value.includes(p))
	}

	activate(...featureFlags: Array<keyof MoDeL.FeatureFlags>) {
		StorageContainer.FeatureFlags.value = [
			...featureFlags,
			...StorageContainer.FeatureFlags.value,
		]
	}

	deactivate(...featureFlags: Array<keyof MoDeL.FeatureFlags>) {
		StorageContainer.FeatureFlags.value =
			StorageContainer.FeatureFlags.value.filter(p => featureFlags.includes(p) === false)
	}
}

declare global {
	namespace MoDeL {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface FeatureFlags { }
	}
}