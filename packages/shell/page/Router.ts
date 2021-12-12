/* eslint-disable @typescript-eslint/member-ordering */
import { HttpErrorCode } from '../../utilities'
import { PageError } from './PageError'
import { PageComponentConstructor, PageParameters, PageComponent } from './PageComponent'
import RouteParser from 'route-parser'

type Page = PageComponent<any>
type PageConstructor = PageComponentConstructor<any>

export const enum RouteMatchMode {
	All = 'all',
	IgnoreParameters = 'ignore-parameters',
}

class Router {
	private static readonly notFoundPage = new PageError({ error: HttpErrorCode.NotFound })

	constructor() {
		window.addEventListener('MoDeL.initialize', () => {
			const isHomePage = ['/', ''].includes(window.location.pathname)
			if (isHomePage && this._homePageConstructor) {
				this.navigateToPage(new this._homePageConstructor())
			} else {
				this.navigateToCurrentPage()
			}

			window.onpopstate = () => this.navigateToCurrentPage()
		})
	}

	private _homePageConstructor?: PageConstructor
	set homePageConstructor(page: PageConstructor) { this._homePageConstructor = page }

	private readonly pageByRoute = new Map<string, PageConstructor>()

	register(route: string, page: PageConstructor) {
		this.pageByRoute.set(route, page)
	}

	navigateToCurrentPage() {
		const currentPageConstructor = this.getPageByPath()
		const parameters = this.getPageParametersByPath()
		const page = currentPageConstructor ? new currentPageConstructor(parameters) : Router.notFoundPage
		this.navigateToPage(page)
	}

	navigateToPage(page: Page) {
		this.setPathByPage(page)
		page.navigate()
	}

	setPathByPage(page: Page) {
		const path = this.getRouteByPage(page)
		if (path) {
			this.path = path
		}
	}

	get path() {
		return window.location.pathname + window.location.search
	}

	set path(value) {
		if (this.path !== value) {
			history.pushState(null, '', value)
		}
	}

	getRouteByPath(path = this.path) {
		return this.getRoutePagePairByPath(path)?.[0] ?? path
	}

	getPageByPath(path = this.path) {
		return this.getRoutePagePairByPath(path)?.[1]
	}

	private getRoutePagePairByPath(path = this.path) {
		return Array.from(this.pageByRoute)
			.find(([route]) => this.getPageParametersByRoute(route, path) !== undefined)
	}

	getRouteByPage(page: Page) {
		return Array.from(this.pageByRoute)
			.filter(([, pageConstructor]) => pageConstructor === page.constructor)
			.map(([route]) => this.getRouteByParameters(route, page['parameters']))
			.find((route): route is string => route !== undefined)
	}

	arePagesEqual(page1: Page, page2: Page, mode = RouteMatchMode.All) {
		return page1.constructor === page2.constructor
			&& (this.getRouteByPage(page1) === this.getRouteByPage(page2) || mode === RouteMatchMode.IgnoreParameters)
	}

	getPageParametersByPath(path = this.path) {
		const route = this.getRouteByPath(path)
		const parameters = !route ? {} : this.getPageParametersByRoute(route, path) ?? {}
		return Object.fromEntries(
			Object.entries(parameters).map(([key, value]) => {
				const numberValue = Number(value)
				return [key, isNaN(numberValue) ? value : numberValue]
			})
		)
	}

	private getPageParametersByRoute(route: string, path: string) {
		return new RouteParser(route).match(path) as PageParameters || undefined
	}

	private getRouteByParameters(route: string, parameters: PageParameters) {
		return new RouteParser(route).reverse(parameters || {}) || undefined
	}
}

// @ts-ignore was readonly
MoDeL.Router = new Router

declare global {
	// eslint-disable-next-line
	namespace MoDeL {
		interface Globals {
			// eslint-disable-next-line
			readonly Router: Router
		}
	}
}