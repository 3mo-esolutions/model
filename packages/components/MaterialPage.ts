import { component, html, css, property, Component, event } from '@a11d/lit'
import { PageComponent } from '@a11d/lit-application'

/**
 * @slot
 * @slot pageHeading
 * @slot pageHeadingDetails
 */
@component('mo-page')
@PageComponent.pageElement()
export class MaterialPage extends Component {
	@event({ bubbles: true, composed: true, cancelable: true }) readonly pageHeadingChange!: EventDispatcher<string>

	@property() heading = ''
	@property({ type: Boolean, reflect: true }) fullHeight = false

	protected override connected() {
		this.connectPageElementsToApplicationSlot('pageHeading')
	}

	protected override disconnected() {
		this.disconnectElementsFromApplicationSlot('pageHeading')
	}

	private connectPageElementsToApplicationSlot(slotName: string) {
		if (MoDeL.environment === 'test') {
			return []
		}
		const elements = [...this.querySelectorAll(`[slot=${slotName}]`)]
		this.disconnectElementsFromApplicationSlot(slotName)
		MoDeL.application.append(...elements)
		return elements
	}

	private disconnectElementsFromApplicationSlot(slotName: string) {
		Array.from(MoDeL.application.querySelectorAll(`[slot=${slotName}]`)).forEach(element => element.remove())
	}

	static override get styles() {
		return css`
			:host {
				margin: var(--mo-page-margin, var(--mo-thickness-l) var(--mo-thickness-xxl) var(--mo-thickness-xxl) var(--mo-thickness-xxl));
				display: inherit;
				animation: transitionIn var(--mo-duration-quick);
			}

			slot[name=pageHeading] {
				font-size: var(--mo-font-size-l);
				font-weight: 500;
				color: var(--mo-color-accent);
			}

			:host([fullHeight]) {
				height: calc(100% - 2 * var(--mo-page-margin, var(--mo-thickness-xxl)));
				width: calc(100% - 2 * var(--mo-page-margin, var(--mo-thickness-xxl)));
			}

			#container {
				height: 100%;
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
		return html`
			<mo-flex id='container' gap='var(--mo-thickness-l)'>
				<mo-flex direction='horizontal' justifyContent='space-between' alignItems='center'>
					<slot name='pageHeading'>${this.heading}</slot>
					<slot name='pageHeadingDetails'></slot>
				</mo-flex>
				<slot></slot>
			</mo-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-page': MaterialPage
	}
}