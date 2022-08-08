import { Component } from '../../library'
import { Page } from './Page'
import type { PageHost } from './PageHost'
import { querySymbolizedElement } from '../../utilities'

export type PageParameters = void | Record<string, string | number | undefined>

export const enum PageNavigationStrategy { Page, Tab, Window }

export interface PageComponentConstructor<T extends PageParameters> extends Constructor<PageComponent<T>> {
	getHost(): Promise<PageHost>
}

export abstract class PageComponent<T extends PageParameters = void> extends Component {
	private static readonly pageElementConstructorSymbol = Symbol('PageComponent.PageElementConstructor')

	static pageElement() {
		return (constructor: Constructor<Page>) => {
			(constructor as any)[PageComponent.pageElementConstructorSymbol] = true
		}
	}

	static getHost() {
		return Promise.resolve(MoDeL.application.pageHost)
	}

	@querySymbolizedElement(PageComponent.pageElementConstructorSymbol) readonly pageElement!: Page

	override['constructor']!: PageComponentConstructor<T>

	constructor(readonly parameters: T) {
		super()
		// The router always returns an empty record
		// whenever no parameters are found in the URL
		// Not doing this, therefore, leads to 2 page renders.
		this.parameters ||= {} as T
	}

	getHost() {
		return this.constructor.getHost()
	}

	async navigate(strategy = PageNavigationStrategy.Page, force = false) {
		const host = await this.getHost()
		await host.navigateToPage(this, strategy, force)
	}

	protected refresh(parameters = this.parameters) {
		return new this.constructor(parameters).navigate(PageNavigationStrategy.Page, true)
	}
}