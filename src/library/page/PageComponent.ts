import { PropertyValues, Component, PageHost, ComponentConstructor } from '..'
import { NavigationMode } from './PageHost'

export type PageParameters = void | Record<string, string | number | undefined>

export interface PageComponentConstructor<T extends PageParameters> extends Constructor<PageComponent<T>>, ComponentConstructor {
	authorizations: Array<keyof MoDeL.Authorizations>
}

export abstract class PageComponent<T extends PageParameters = void> extends Component {
	['constructor']: PageComponentConstructor<T>

	static authorizations = new Array<keyof MoDeL.Authorizations>()

	navigate() {
		PageHost.navigateToPage(this, NavigationMode.Navigate)
	}

	open() {
		PageHost.navigateToPage(this, NavigationMode.NewTab)
	}

	openInNewWindow() {
		PageHost.navigateToPage(this, NavigationMode.NewWindow)
	}

	constructor(parameters: T) {
		super()
		this.parameters = parameters as T
	}

	protected readonly parameters = {} as T

	protected firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		if (this.page === undefined) {
			throw new Error(`${this.constructor.name} does not wrap its content in a 'mo-page' element`)
		}
	}

	protected get page() {
		return this.shadowRoot.querySelector('mo-page') ?? undefined
	}
}