import { component, html, property, Component, PageHost } from '../library'

@component('mo-page')
export default class Page extends Component {
	private _header = ''
	@property()
	get header() { return this._header }
	set header(value) {
		this._header = value
		if (this.isConnected) {
			MoDeL.applicationHost.pageTitle = value
			document.title = `${MoDeL.applicationHost.pageTitle} | ${MoDeL.applicationHost.appTitle}`
		}
	}

	connectedCallback() {
		super.connectedCallback()
		this.header = this.header
	}

	@property({ type: Boolean })
	set fullHeight(value: boolean) {
		this.style.height = PageHost.currentPage.style.height = value ? '100%' : ''
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