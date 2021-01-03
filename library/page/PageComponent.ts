import { PropertyValues, Component, PageHost, ComponentConstructor } from '..'
import { NavigationMode } from './PageHost'

export type PageParameters = void | Record<string, string | number | undefined>

export interface PageComponentConstructor<T extends PageParameters> extends Constructor<PageComponent<T>>, ComponentConstructor {
	permissions: Array<keyof MoDeL.Permissions>
}

export abstract class PageComponent<T extends PageParameters = void> extends Component {
	['constructor']: PageComponentConstructor<T>

	static permissions = new Array<keyof MoDeL.Permissions>()

	@eventProperty() readonly closed!: IEvent<boolean>

	async navigate() {
		PageHost.navigateToPage(this, NavigationMode.Navigate)
	}

	async open() {
		PageHost.navigateToPage(this, NavigationMode.NewTab)
	}

	async openInNewWindow() {
		PageHost.navigateToPage(this, NavigationMode.NewWindow)
	}

	constructor(parameters: T) {
		super()
		this.parameters = parameters as T
	}

	protected readonly parameters: T

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