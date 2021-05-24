import { PageComponent, event } from '..'
import Route from 'route-parser'
import { PageComponentConstructor, PageParameters } from './PageComponent'

class Router {
	@event() readonly navigated!: IEvent<PageComponentConstructor<any> | undefined>

	HomePageConstructor?: PageComponentConstructor<any>

	private readonly routes = new Map<string, PageComponentConstructor<any>>()

	constructor() {
		window.onpopstate = () => this.triggerNavigationEvent()
	}

	private triggerNavigationEvent() {
		const currentPage = this.getPage(this.relativePath)
		this.navigated.dispatch(currentPage)
	}

	private get routesArray() { return Array.from(this.routes.entries()) }

	get relativePath() {
		return window.location.pathname + window.location.search
	}

	set relativePath(value: string) {
		if (window.location.pathname !== value) {
			history.pushState(null, '', value)
		}
		this.triggerNavigationEvent()
	}

	addRoute(route: string, pageType: PageComponentConstructor<any>) {
		this.routes.set(route, pageType)
	}

	getPage(relativePath: string): PageComponentConstructor<any> | undefined {
		return this.routesArray.find(routePair => new Route(routePair[0]).match(relativePath))?.[1] ?? undefined
	}

	getRouterPath(relativePath: string): string {
		return this.routesArray.find(routePair => new Route(routePair[0]).match(relativePath))?.[0] ?? relativePath
	}

	doesPathMatchPage(path: string, page: PageComponentConstructor<any>): boolean {
		return this.getPage(path) === page
	}

	getRouterPaths(page: PageComponentConstructor<any>): Array<string> {
		return this.routesArray
			.filter(routePair => this.routes.get(routePair[0]) === page)
			.map(routePair => routePair[0])
	}

	getParameters(relativePath: string): PageParameters {
		const routerPath = this.getRouterPath(relativePath)

		if (!routerPath) {
			return {}
		}

		const params = new Route(routerPath).match(relativePath) as Record<string, string | number>
		Object.getOwnPropertyNames(params).forEach(paramName => {
			const paramNumber = Number(params[paramName].toString())
			if (!Number.isNaN(paramNumber)) {
				params[paramName] = paramNumber
			}
		})
		return params
	}

	injectParametersToPath(relativePath: string, parameters: PageParameters) {
		const routerPath = this.getRouterPath(relativePath)
		const route = new Route(routerPath).reverse(parameters ? parameters : {})
		if (!route) {
			return this.relativePath
		}
		return route
	}

	getPath(page: PageComponent<any>) {
		const path = this.getRouterPaths(page.constructor)
			.map(p => new Route(p))
			.find(r => r.reverse(page['parameters']) !== false)
			?.reverse(page['parameters'])

		return path ? path : undefined
	}
}

// @ts-ignore was readonly
MoDeL.Router = new Router
export default MoDeL.Router

declare global {
	// eslint-disable-next-line
	namespace MoDeL {
		interface Globals {
			// eslint-disable-next-line
			readonly Router: Router
		}
	}
}