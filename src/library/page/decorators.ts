import { PageComponentConstructor, PageParameters } from './PageComponent'
import Router from './Router'

export const route = (...routes: Array<string>) => {
	return <T extends PageParameters>(pageConstructor: PageComponentConstructor<T>) => {
		routes.forEach(route => Router.addRoute(route, pageConstructor))
	}
}

export const homePage = <T extends PageParameters>(pageConstructor: PageComponentConstructor<T>) => {
	Router.HomePageConstructor = pageConstructor
}

export const authorize = <TConstructor extends { authorizations: Array<keyof MoDeL.Authorizations> }>(...authorizations: Array<keyof MoDeL.Authorizations>) => {
	return (constructor: TConstructor) => {
		constructor.authorizations = authorizations
	}
}