import { StorageContainer } from '.'

export default new class PermissionHelper {
	isAuthorized(...permissions: Array<keyof MoDeL.Permissions>) {
		return permissions.every(p => StorageContainer.Permissions.value.includes(p))
	}

	authorize(...permissions: Array<keyof MoDeL.Permissions>) {
		StorageContainer.Permissions.value = [
			...permissions,
			...StorageContainer.Permissions.value,
		]
	}

	unauthorize(...permissions: Array<keyof MoDeL.Permissions>) {
		StorageContainer.Permissions.value =
			StorageContainer.Permissions.value.filter(p => permissions.includes(p) === false)
	}
}

declare global {
	namespace MoDeL {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface Permissions { }
	}
}