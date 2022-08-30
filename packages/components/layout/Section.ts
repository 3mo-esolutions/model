import { Component, component, css, html, property, style } from '../../library'
import { SlotController } from '../../utilities'

/**
 * @slot - Content
 * @slot heading - The heading which has a default template rendering a mo-heading element
 * @slot action - Actions in the header
 */
@component('mo-section')
export class Section extends Component {
	@property() heading = ''

	private readonly slotController = new SlotController(this)

	static override get styles() {
		return css`
			:host {
				display: block;
			}

			slot[name=action], slot[name=heading], slot[name=heading]::slotted(*) {
				color: var(--mo-color-accent);
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex gap='var(--mo-thickness-l)' ${style({ width: '100%', height: '100%' })}>
				<mo-flex direction='horizontal' alignItems='center' ${style({ minHeight: '30px' })}>
					<slot name='heading'>
						${this.headingTemplate}
					</slot>
					<slot name='action'></slot>
				</mo-flex>

				${this.contentTemplate}
			</mo-flex>
		`
	}

	protected get headingTemplate() {
		return html`
			<mo-heading part='heading' typography='heading4' ${style({ fontWeight: '500' })}>
				${this.heading}
			</mo-heading>
		`
	}

	protected get contentTemplate() {
		const hasContent = this.slotController.hasSlottedElements('')
		return html`
			<mo-grid ?hidden=${!hasContent} ${style({ height: '*' })}>
				<slot></slot>
			</mo-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-section': Section
	}
}