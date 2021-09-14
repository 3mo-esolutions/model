import { component, html, css, property, Component, PageHost } from '..'

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
		this.connectPageElementsToApplicationSlot('pageHeader')
		const elements = this.connectPageElementsToApplicationSlot('pageHeaderDetails')
		MoDeL.application.topAppBarProminent = elements.length > 0
	}

	protected override disconnected() {
		this.disconnectElementsFromApplicationSlot('pageHeader')
		this.disconnectElementsFromApplicationSlot('pageHeaderDetails')
	}

	private connectPageElementsToApplicationSlot(slotName: string) {
		if (MoDeL.environment === 'test') {
			return []
		}
		const elements = this.querySelectorAll(`[slot=${slotName}]`)
		this.disconnectElementsFromApplicationSlot(slotName)
		MoDeL.application.append(...elements)
		return Array.from(elements)
	}

	private disconnectElementsFromApplicationSlot(slotName: string) {
		Array.from(MoDeL.application.querySelectorAll(`[slot=${slotName}]`)).forEach(element => element.remove())
	}

	static override get styles() {
		return css`
			:host {
				display: inherit;
				animation: transitionIn var(--mo-duration-quick);
			}

			::slotted {
				height: 100%;
			}

			@keyframes transitionIn
			{
				0% {
					visibility: hidden;
					transform: translate3d(0, 100px, 100px);
					opacity: 0;
				}
				100% {
					visibility: visible;
					transform: translate3d(0);
					opacity: 1;
				}
			}
		`
	}

	protected override get template() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-page': Page
	}
}