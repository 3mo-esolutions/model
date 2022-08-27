import { component, html, property, Component, css, nothing, style } from '../../library'
import { SlotController } from '../../utilities'

/**
 * @slot action - Actions in the header
 * @slot heading - Custom heading in the header
 * @slot subHeading - Custom subHeading in the header
 * @slot avatar - Custom avatar in the header
 * @slot header - The header. Using this will lead to slots 'heading', 'subHeading', 'avatar' and 'action's not working.
 * @slot media - Embedded media
 * @slot - Body / Content
 * @slot footer - Actions in the footer
 */
@component('mo-card')
export class Card extends Component {
	@property() heading?: string
	@property() subHeading?: string
	@property() avatar?: string
	@property() image?: string

	private readonly slotController = new SlotController(this)

	static override get styles() {
		return css`
			:host {
				display: block;
				background-color: var(--mo-color-surface);
				box-shadow: var(--mo-shadow);
				border-radius: var(--mo-border-radius);
			}

			slot[name=header] {
				display: flex;
				gap: var(--mo-thickness-m);
				padding: var(--mo-card-header-padding, 16px);
				align-items: center;
			}

			slot[name=heading] {
				display: block;
				flex: 1;
			}

			slot[name=media]:first-child, slot[name=media]::slotted(:first-child) {
				border-radius: var(--mo-border-radius) var(--mo-border-radius) 0 0;
				display: block;
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center center;
				width: 100%;
				object-fit: cover;
			}

			slot:not([name]) {
				display: block;
				flex: 1;
			}

			:host([hasBody]) slot:not([name]) {
				padding: var(--mo-card-body-padding, 16px);
			}

			:host([hasBody][hasHeader]) slot:not([name]) {
				padding: var(--mo-card-body-padding, 0px 16px 16px 16px);
			}

			slot[name=footer] {
				display: block;
				padding: var(--mo-card-footer-padding, 8px);
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex ${style({ width: '100%', height: '100%' })}>
				${this.mediaTemplate}
				${this.headerTemplate}
				${this.bodyTemplate}
				${this.footerTemplate}
			</mo-flex>
		`
	}

	protected get headerTemplate() {
		const hasHeader = this.slotController.hasSlottedElements('header')
			|| !!this.avatar || !!this.heading || !!this.subHeading
			|| this.slotController.hasSlottedElements('avatar') || this.slotController.hasSlottedElements('heading')
			|| this.slotController.hasSlottedElements('subHeading') || this.slotController.hasSlottedElements('action')
		this.switchAttribute('hasHeader', hasHeader)
		return !hasHeader ? nothing : html`
			<slot part='header' name='header'>
				<slot name='avatar'>
					${!this.avatar ? nothing : html`<mo-avatar part='avatar' ${style({ marginRight: 'var(--mo-thickness-m)' })}>${this.avatar}</mo-avatar>`}
				</slot>

				<mo-flex justifyContent='space-around' ${style({ width: '*' })}>
					<slot name='heading'>
						${!this.heading ? nothing : html`<mo-heading part='heading' typography='heading4' ${style({ fontWeight: '500' })}>${this.heading}</mo-heading>`}
					</slot>

					<slot name='subHeading'>
						${!this.subHeading ? nothing : html`<mo-heading part='subHeading' typography='heading6' ${style({ fontWeight: '400', color: 'var(--mo-color-gray)' })}>${this.subHeading}</mo-heading>`}
					</slot>
				</mo-flex>
				<slot name='action'></slot>
			</slot>
		`
	}

	protected get mediaTemplate() {
		const hasMedia = !!this.image || this.slotController.hasSlottedElements('media')
		return !hasMedia ? nothing : html`
			<slot part='media' name='media'>
				${!this.image ? nothing : html`<img part='media' src=${this.image} />`}
			</slot>
		`
	}

	protected get bodyTemplate() {
		this.switchAttribute('hasBody', this.slotController.hasSlottedElements(''))
		return html`<slot></slot>`
	}

	protected get footerTemplate() {
		return !this.slotController.hasSlottedElements('footer') ? nothing : html`<slot part='footer' name='footer'></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-card': Card
	}
}