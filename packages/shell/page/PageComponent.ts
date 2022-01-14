import { PropertyValues, Component, ComponentConstructor, event, query } from '../../library'
import { Page } from './Page'
import type { PageHost } from './PageHost'

export type PageParameters = void | Record<string, string | number | undefined>

export const enum PageNavigationStrategy { Page, Tab, Window }

export interface PageComponentConstructor<T extends PageParameters> extends Constructor<PageComponent<T>>, ComponentConstructor {
	getHost(): Promise<PageHost>
}

export abstract class PageComponent<T extends PageParameters = void> extends Component {
	static getHost() {
		return Promise.resolve(MoDeL.application.pageHost)
	}

	@event() readonly headingChange!: EventDispatcher<string>

	@query('mo-page') protected readonly pageElement?: Page

	override['constructor']: PageComponentConstructor<T>

	constructor(readonly parameters: T) {
		super()
		// The router always returns an empty record
		// whenever no parameters are found in the URL
		// Not doing this, therefore, leads to 2 page renders.
		this.parameters = this.parameters || {} as T
	}

	getHost() {
		return this.constructor.getHost()
	}

	async navigate(strategy = PageNavigationStrategy.Page, force = false) {
		const host = await this.getHost()
		host.navigateToPage(this, strategy, force)
	}

	protected refresh(parameters = this.parameters) {
		return new this.constructor(parameters).navigate(PageNavigationStrategy.Page, true)
	}

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		if (this.pageElement === undefined) {
			throw new Error(`${this.constructor.name} does not wrap its content in a 'mo-page' element`)
		}
		this.headingChange.dispatch(this.pageElement.heading)
		this.pageElement.headingChange.subscribe(heading => this.headingChange.dispatch(heading))
	}
}