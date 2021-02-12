import { component, html, property, Component, PageHost } from '../library'

@component('mo-page')
export default class Page extends Component {
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

	connectedCallback() {
		super.connectedCallback()
		this.header = this.header
	}

	@property({ type: Boolean })
	set fullHeight(value: boolean) {
		PageHost.currentPage.style.flex = value ? '1' : ''
		this.style.height = value ? 'calc(100% - 5px)' : ''
	}

	protected initialized() {
		this.handleTopAppBarDetails()
	}

	protected uninitialized() {
		MoDeL.application.topAppBarDetailsSlot.innerHTML = ''
	}

	private handleTopAppBarDetails() {
		const topAppBarDetails = this.querySelector('[slot="topAppBarDetails"]') as HTMLElement
		if (topAppBarDetails) {
			MoDeL.application.topAppBarDetailsSlot.innerHTML = ''
			MoDeL.application.topAppBarDetailsSlot.appendChild(topAppBarDetails)
		}
		MoDeL.application.topAppBarProminent = !!topAppBarDetails
	}

	protected render() {
		return html`
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
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-page': Page
	}
}