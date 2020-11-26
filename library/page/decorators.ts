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

export const authorize = <TConstructor extends { permissions: Array<keyof MDC.Permissions> }>(...permissions: Array<keyof MDC.Permissions>) => {
	return (constructor: TConstructor) => {
		constructor.permissions = permissions
	}
}