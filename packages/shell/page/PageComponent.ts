import { PropertyValues, Component, ComponentConstructor } from '../../library'
import { NavigationMode, PageHost } from './PageHost'

export type PageParameters = void | Record<string, string | number | undefined>

export interface PageComponentConstructor<T extends PageParameters> extends Constructor<PageComponent<T>>, ComponentConstructor {
	authorizations: Array<keyof MoDeL.Authorizations>
	getHost(): Promise<PageHost>
}

export abstract class PageComponent<T extends PageParameters = void> extends Component {
	static authorizations = new Array<keyof MoDeL.Authorizations>()

	static getHost() {
		return Promise.resolve(MoDeL.application.pageHost)
	}

	override ['constructor']: PageComponentConstructor<T>

	constructor(protected readonly parameters: T) {
		super()
		// The router always returns an empty record
		// whenever no parameters are found in the URL
		// Not doing this, therefore, leads to 2 page renders.
		this.parameters = this.parameters || {} as T
	}

	getHost() {
		return this.constructor.getHost()
	}

	navigate() {
		return this.handleNavigation(NavigationMode.Navigate)
	}

	open() {
		return this.handleNavigation(NavigationMode.NewTab)
	}

	openInNewWindow() {
		return this.handleNavigation(NavigationMode.NewWindow)
	}

	protected async handleNavigation(mode: NavigationMode) {
		const host = await this.getHost()
		host.navigateToPage(this, mode)
	}

	protected refresh() {
		this.remove()
		new this.constructor(this.parameters).navigate()
	}

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		if (this.page === undefined) {
			throw new Error(`${this.constructor.name} does not wrap its content in a 'mo-page' element`)
		}
	}

	protected get page() {
		return this.shadowRoot.querySelector('mo-page') ?? undefined
	}
}