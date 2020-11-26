import { StorageContainer } from '.'

export default new class PermissionHelper {
	isAuthorized(...permissions: Array<keyof MDC.Permissions>) {
		return permissions.every(p => StorageContainer.Permissions.value.includes(p))
	}

	authorize(...permissions: Array<keyof MDC.Permissions>) {
		StorageContainer.Permissions.value = [
			...permissions,
			...StorageContainer.Permissions.value,
		]
	}

	unauthorize(...permissions: Array<keyof MDC.Permissions>) {
		StorageContainer.Permissions.value =
			StorageContainer.Permissions.value.filter(p => permissions.includes(p) === false)
	}
}