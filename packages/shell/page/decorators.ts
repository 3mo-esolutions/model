import { PageComponentConstructor, PageParameters } from './PageComponent'

export const route = (...routes: Array<string>) => {
	return <T extends PageParameters>(pageConstructor: PageComponentConstructor<T>) => {
		routes.forEach(route => MoDeL.Router.addRoute(route, pageConstructor))
	}
}

export const homePage = <T extends PageParameters>(pageConstructor: PageComponentConstructor<T>) => {
	MoDeL.Router.HomePageConstructor = pageConstructor
}

export const authorize = <TConstructor extends { authorizations: Array<keyof MoDeL.Authorizations> }>(...authorizations: Array<keyof MoDeL.Authorizations>) => {
	return (constructor: TConstructor) => {
		constructor.authorizations = authorizations
	}
}