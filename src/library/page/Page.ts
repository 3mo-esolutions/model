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
		this.style.height = value ? '100%' : ''
	}

	protected override connected() {
		this.connectElementsWithinPageToElement('pageHeader')
		const elements = this.connectElementsWithinPageToElement('pageHeaderDetails')
		MoDeL.application.topAppBarProminent = elements.length > 0
	}

	protected override disconnected() {
		this.disconnectElementsWithinPageToElement('pageHeader')
		this.disconnectElementsWithinPageToElement('pageHeaderDetails')
	}

	private connectElementsWithinPageToElement(slotName: string) {
		if (MoDeL.environment === 'test') {
			return []
		}
		const elements = this.querySelectorAll(`[slot=${slotName}]`)
		this.disconnectElementsWithinPageToElement(slotName)
		MoDeL.application.append(...elements)
		return Array.from(elements)
	}

	private disconnectElementsWithinPageToElement(slotName: string) {
		Array.from(MoDeL.application.querySelectorAll(`[slot=${slotName}]`)).forEach(element => element.remove())
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