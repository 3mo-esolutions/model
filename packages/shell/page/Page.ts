import { component, html, css, property, Component } from '../../library'
import { PageComponent } from './PageComponent'

/**
 * @slot
 * @slot pageHeading
 * @slot pageHeadingDetails
 */
@component('mo-page')
export class Page extends Component {
	@property({
		async observer(this: Page) {
			const pageComponent = await this.getPageComponent()
			const pageHost = await pageComponent.getHost()
			if (pageHost.isRoot) {
				MoDeL.application.pageHeading = this.heading
				document.title = `${MoDeL.application.pageHeading} | ${Manifest.short_name}`
			}
		}
	}) heading = ''

	@property({ type: Boolean })
	set fullHeight(value: boolean) {
		this.style.height = value ? '100%' : ''
		this.setPageComponentFlex(value)
	}

	private async setPageComponentFlex(value: boolean) {
		const pageComponent = await this.getPageComponent()
		pageComponent.style.flex = value ? '1' : ''
	}

	private async getPageComponent() {
		await this.updateComplete
		return (this.parentNode as ShadowRoot).host as PageComponent<any>
	}

	protected override connected() {
		this.connectPageElementsToApplicationSlot('pageHeading')
		const elements = this.connectPageElementsToApplicationSlot('pageHeadingDetails')
		MoDeL.application.topAppBarProminent = elements.length > 0
	}

	protected override disconnected() {
		this.disconnectElementsFromApplicationSlot('pageHeading')
		this.disconnectElementsFromApplicationSlot('pageHeadingDetails')
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

			:host([fullHeight]) ::slotted(*:not([slot])) {
				height: 100%;
				width: 100%;
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