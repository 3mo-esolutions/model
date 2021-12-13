import { PageComponent, PageComponentConstructor, PageParameters } from './PageComponent'
import { PageHost } from './PageHost'

export const route = (...routes: Array<string>) => {
	return <T extends PageParameters>(pageConstructor: PageComponentConstructor<T>) => {
		routes.forEach(route => MoDeL.Router.register(route, pageConstructor))
	}
}

export const routeHost = (routePageConstructor: PageComponentConstructor<any>, pageHostQuery = 'mo-page-host') => {
	const getPageHost = async () => {
		const pageHost = await routePageConstructor.getHost()
		if ((pageHost.currentPage instanceof routePageConstructor) === false) {
			const page = new routePageConstructor()
			await page.navigate()
			await page.updateComplete
		}
		const page = pageHost.currentPage as PageComponent<any>
		return page.shadowRoot.querySelector(pageHostQuery) as PageHost
	}
	return (pageConstructor: Constructor<PageComponent> | AbstractConstructor<PageComponent>) => {
		// @ts-expect-error getHost also exists in an abstract constructor of a PageComponent
		pageConstructor.getHost = getPageHost
	}
}

export const homePage = <T extends PageParameters>(pageConstructor: PageComponentConstructor<T>) => {
	MoDeL.Router.homePageConstructor = pageConstructor
}

export const authorize = <TConstructor extends { authorizations: Array<keyof MoDeL.Authorizations> }>(...authorizations: Array<keyof MoDeL.Authorizations>) => {
	return (constructor: TConstructor) => {
		constructor.authorizations = authorizations
	}
}