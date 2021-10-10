import { LocalStorageEntry } from '../../utilities'

export class AuthorizationHelper {
	private static readonly storage = new LocalStorageEntry('MoDeL.Authorizations', new Array<keyof MoDeL.Authorizations>())

	static isAuthorized(...authorizations: Array<keyof MoDeL.Authorizations>) {
		return authorizations.every(p => AuthorizationHelper.storage.value.includes(p))
	}

	static authorize(...authorizations: Array<keyof MoDeL.Authorizations>) {
		AuthorizationHelper.storage.value = [
			...authorizations,
			...AuthorizationHelper.storage.value,
		]
	}

	static unauthorize(...authorizations: Array<keyof MoDeL.Authorizations>) {
		AuthorizationHelper.storage.value =
			AuthorizationHelper.storage.value.filter(p => authorizations.includes(p) === false)
	}
}

declare global {
	namespace MoDeL {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface Authorizations { }
	}
}