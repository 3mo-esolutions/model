import { LocalStorageEntry } from '../../utilities'
import { DialogComponent, PageComponent } from '..'

type AuthorizationKey = keyof MoDeL.Authorizations
type AuthorizableComponent = DialogComponent<any, any> | PageComponent<any>

export const authorization = <TConstructor extends Constructor<AuthorizableComponent>>(...authorizations: Array<AuthorizationKey>) => {
	return (Constructor: TConstructor) => {
		AuthorizationHelper.addAuthorizationsByComponent(Constructor, authorizations)
	}
}

export class AuthorizationHelper {
	private static readonly storage = new LocalStorageEntry('MoDeL.Authorizations', new Array<AuthorizationKey>())
	private static readonly authorizationsByComponent = new Map<Constructor<AuthorizableComponent>, Array<AuthorizationKey>>()

	static addAuthorizationsByComponent(component: Constructor<AuthorizableComponent>, authorizations: Array<AuthorizationKey>) {
		this.authorizationsByComponent.set(component, authorizations)
	}

	static componentAuthorized(component: AuthorizableComponent) {
		const ComponentConstructor = component.constructor as Constructor<AuthorizableComponent>
		return AuthorizationHelper.authorized(...AuthorizationHelper.authorizationsByComponent.get(ComponentConstructor) ?? [])
	}

	static authorized(...authorizations: Array<AuthorizationKey>) {
		return authorizations.every(p => AuthorizationHelper.storage.value.includes(p))
	}

	static authorize(...authorizations: Array<AuthorizationKey>) {
		AuthorizationHelper.storage.value = [
			...authorizations,
			...AuthorizationHelper.storage.value,
		]
	}

	static unauthorize(...authorizations: Array<AuthorizationKey>) {
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