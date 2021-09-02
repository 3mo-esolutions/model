import { component, html, property, Component, PageHost } from '..'

@component('mo-page')
export class Page extends Component {
	private _header = ''
	@property()
	get header() { return this._header }
	set header(value) {
		this._header = value
		if (this.isConnected) {
			MoDeL.application.pageTitle = value
			document.title = `${MoDeL.application.pageTitle} | ${Manifest.short_name}`
		}
	}

	override connectedCallback() {
		super.connectedCallback()
		this.header = this.header
	}

	@property({ type: Boolean })
	set fullHeight(value: boolean) {
		if (PageHost.currentPage) {
			PageHost.currentPage.style.flex = value ? '1' : ''
		}
		this.style.height = value ? 'calc(100% - 5px)' : ''
	}

	protected override connected() {
		this.handleTopAppBarDetails()
		this.handleHeader()
	}

	protected override disconnected() {
		MoDeL.application.topAppBarDetailsSlot.innerHTML = ''
		MoDeL.application.headerSlot.innerHTML = ''
	}

	private handleTopAppBarDetails() {
		const elements = this.mountElementsWithinPageToElement('topAppBarDetails', MoDeL.application.topAppBarDetailsSlot)
		MoDeL.application.topAppBarProminent = elements.length > 0
	}

	private handleHeader() {
		this.mountElementsWithinPageToElement('header', MoDeL.application.headerSlot)
	}

	private mountElementsWithinPageToElement(slotName: string, element: HTMLElement) {
		if (MoDeL.environment === 'test') {
			return []
		}
		const elements = this.querySelectorAll(`[slot=${slotName}]`)
		element.innerHTML = ''
		element.append(...elements)
		return Array.from(elements)
	}

	protected override render = () => html`
		<style>
			:host {
				display: inherit;
			}

			::slotted {
				height: 100%;
			}
		</style>
		<slot></slot>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-page': Page
	}
}