import { LocalStorageEntry } from '.'

export default new class AuthorizationHelper {
	static readonly Authorizations = new LocalStorageEntry('MoDeL.Authorizations', new Array<keyof MoDeL.Authorizations>())

	isAuthorized(...authorizations: Array<keyof MoDeL.Authorizations>) {
		return authorizations.every(p => AuthorizationHelper.Authorizations.value.includes(p))
	}

	authorize(...authorizations: Array<keyof MoDeL.Authorizations>) {
		AuthorizationHelper.Authorizations.value = [
			...authorizations,
			...AuthorizationHelper.Authorizations.value,
		]
	}

	unauthorize(...authorizations: Array<keyof MoDeL.Authorizations>) {
		AuthorizationHelper.Authorizations.value =
			AuthorizationHelper.Authorizations.value.filter(p => authorizations.includes(p) === false)
	}
}

declare global {
	namespace MoDeL {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface Authorizations { }
	}
}