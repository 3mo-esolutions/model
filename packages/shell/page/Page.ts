import { component, html, css, property, Component, event } from '../../library'
import { PageComponent } from './PageComponent'

/**
 * @slot
 * @slot pageHeading
 * @slot pageHeadingDetails
 */
@component('mo-page')
@PageComponent.pageElement()
export class Page extends Component {
	@event() readonly headingChange!: EventDispatcher<string>

	@property({ updated(this: Page) { this.headingChange.dispatch(this.heading) } }) heading = ''
	@property({ type: Boolean, reflect: true }) fullHeight = false

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
				margin: var(--mo-page-margin, var(--mo-thickness-xxl));
				display: inherit;
				animation: transitionIn var(--mo-duration-quick);
			}

			:host([fullHeight]) {
				height: calc(100% - 2 * var(--mo-page-margin, var(--mo-thickness-xxl)));
				width: calc(100% - 2 * var(--mo-page-margin, var(--mo-thickness-xxl)));
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