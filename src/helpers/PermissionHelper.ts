import { LocalStorageEntry } from '.'

export default new class PermissionHelper {
	static readonly Permissions = new LocalStorageEntry('MoDeL.Permissions', new Array<keyof MoDeL.Permissions>())

	isAuthorized(...permissions: Array<keyof MoDeL.Permissions>) {
		return permissions.every(p => PermissionHelper.Permissions.value.includes(p))
	}

	authorize(...permissions: Array<keyof MoDeL.Permissions>) {
		PermissionHelper.Permissions.value = [
			...permissions,
			...PermissionHelper.Permissions.value,
		]
	}

	unauthorize(...permissions: Array<keyof MoDeL.Permissions>) {
		PermissionHelper.Permissions.value =
			PermissionHelper.Permissions.value.filter(p => permissions.includes(p) === false)
	}
}

declare global {
	namespace MoDeL {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface Permissions { }
	}
}