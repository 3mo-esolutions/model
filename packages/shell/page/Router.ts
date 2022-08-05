/* eslint-disable @typescript-eslint/member-ordering */
import { HttpErrorCode } from '../../utilities'
import { PageComponentConstructor, PageParameters, PageComponent } from './PageComponent'
import { PageHost } from '.'
import { PageError } from './PageError'
import RouteParser from 'route-parser'

type Page = PageComponent<any>
type PageConstructor = PageComponentConstructor<any>

export const enum RouteMatchMode {
	All = 'all',
	IgnoreParameters = 'ignore-parameters',
}

export const route = (...routes: Array<string>) => {
	return <T extends PageParameters>(pageConstructor: PageComponentConstructor<T>) => {
		routes.forEach(route => Router.register(route, pageConstructor))
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
		return page.renderRoot.querySelector(pageHostQuery) as PageHost
	}
	return (pageConstructor: Constructor<PageComponent<any>> | AbstractConstructor<PageComponent<any>>) => {
		// @ts-expect-error getHost also exists in an abstract constructor of a PageComponent
		pageConstructor.getHost = getPageHost
	}
}

export const homePage = () => <T extends PageParameters>(pageConstructor: PageComponentConstructor<T>) => {
	Router.homePageConstructor = pageConstructor
}

export class Router {
	private static readonly notFoundPage = new PageError({ error: HttpErrorCode.NotFound })

	private static _homePageConstructor?: PageConstructor
	static set homePageConstructor(page: PageConstructor) { Router._homePageConstructor = page }

	private static readonly pageByRoute = new Map<string, PageConstructor>()

	static async initialize() {
		const isHomePage = ['/', ''].includes(window.location.pathname)
		if (isHomePage && Router._homePageConstructor) {
			await Router.navigateToPage(new Router._homePageConstructor())
		} else {
			await Router.navigateToCurrentPage()
		}

		window.addEventListener('popstate', () => Router.navigateToCurrentPage())
	}

	static register(route: string, page: PageConstructor) {
		Router.pageByRoute.set(route, page)
	}

	static async navigateToCurrentPage() {
		const currentPageConstructor = Router.getPageByPath()
		const parameters = Router.getPageParametersByPath()
		const page = currentPageConstructor ? new currentPageConstructor(parameters) : Router.notFoundPage
		await Router.navigateToPage(page)
	}

	static async navigateToPage(page: Page) {
		Router.setPathByPage(page)
		await page.navigate()
	}

	static setPathByPage(page: Page) {
		const path = Router.getRouteByPage(page)
		if (path) {
			Router.path = path
		}
	}

	static get path() {
		return window.location.pathname + window.location.search
	}

	static set path(value) {
		if (Router.path !== value) {
			history.pushState(null, '', value)
		}
	}

	static getRouteByPath(path = Router.path) {
		return Router.getRoutePagePairByPath(path)?.[0] ?? path
	}

	static getPageByPath(path = Router.path) {
		return Router.getRoutePagePairByPath(path)?.[1]
	}

	private static getRoutePagePairByPath(path = Router.path) {
		return Array.from(Router.pageByRoute)
			.find(([route]) => Router.getPageParametersByRoute(route, path) !== undefined)
	}

	static getRouteByPage(page: Page) {
		return Array.from(Router.pageByRoute)
			.filter(([, pageConstructor]) => pageConstructor === page.constructor)
			.map(([route]) => Router.getRouteByParameters(route, page['parameters']))
			.find((route): route is string => route !== undefined)
	}

	static arePagesEqual(page1: Page, page2: Page, mode = RouteMatchMode.All) {
		return page1.constructor === page2.constructor
			&& (Router.getRouteByPage(page1) === Router.getRouteByPage(page2) || mode === RouteMatchMode.IgnoreParameters)
	}

	static getPageParametersByPath(path = Router.path) {
		const route = Router.getRouteByPath(path)
		const parameters = !route ? {} : Router.getPageParametersByRoute(route, path) ?? {}
		return Object.fromEntries(
			Object.entries(parameters).map(([key, value]) => {
				const numberValue = Number(value)
				return [key, isNaN(numberValue) ? value : numberValue]
			})
		)
	}

	private static getPageParametersByRoute(route: string, path: string) {
		return new RouteParser(route).match(path) as PageParameters || undefined
	}

	private static getRouteByParameters(route: string, parameters: PageParameters) {
		return new RouteParser(route).reverse(parameters || {}) || undefined
	}
}

globalThis.Router = Router

type RouterClass = typeof Router

declare global {
	// eslint-disable-next-line
	var Router: RouterClass
}