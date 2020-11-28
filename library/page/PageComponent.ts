/* eslint-disable @typescript-eslint/ban-types */
import { PropertyValues, Component, PageHost } from '..'
import { NavigationMode } from './PageHost'

export type PageParameters = Record<string, string | number | undefined>

export type PageComponentConstructor<T extends PageParameters> = Constructor<PageComponent<T>> & { permissions: Array<keyof MoDeL.Permissions> }

export abstract class PageComponent<T extends PageParameters = {}> extends Component {
	['constructor']: PageComponentConstructor<T>

	static permissions = new Array<keyof MoDeL.Permissions>()

	@eventProperty readonly closed!: IEvent<boolean>

	async navigate() {
		PageHost.navigateToPage(this, NavigationMode.Navigate)
	}

	async open() {
		PageHost.navigateToPage(this, NavigationMode.NewTab)
	}

	async openInNewWindow() {
		PageHost.navigateToPage(this, NavigationMode.NewWindow)
	}

	constructor(parameters?: T) {
		super()
		this.parameters = parameters ?? {} as T
	}

	protected readonly parameters: T

	protected firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		if (this.page === undefined) {
			throw new Error(`${this.constructor.name} does not wrap its content in an 'mo-page' element`)
		}
	}

	protected get page() {
		return this.shadowRoot.querySelector('mo-page') ?? undefined
	}
}