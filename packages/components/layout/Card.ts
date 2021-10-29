import { component, html, property, Component, css, nothing } from '../../library'

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

			slot[name=media] img, slot[name=media]::slotted(img) {
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
			<mo-flex height='100%' width='100%'>
				${this.mediaTemplate}
				${this.headerTemplate}
				${this.bodyTemplate}
				${this.footerTemplate}
			</mo-flex>
		`
	}

	protected get headerTemplate() {
		const hasHeader = this.hasSlottedChildren('header')
			|| !!this.avatar || !!this.heading || !!this.subHeading
			|| this.hasSlottedChildren('avatar') || this.hasSlottedChildren('heading')
			|| this.hasSlottedChildren('subHeading') || this.hasSlottedChildren('action')
		this.switchAttribute('hasHeader', hasHeader)

		return !hasHeader ? nothing : html`
			<slot part='header' name='header'>
				<slot name='avatar'>
					${!this.avatar ? nothing : html`<mo-avatar part='avatar' margin='0 var(--mo-thickness-m) 0 0'>${this.avatar}</mo-avatar>`}
				</slot>

				<mo-flex justifyContent='space-around' width='*'>
					<slot name='heading'>
						${!this.heading ? nothing : html`<mo-heading part='heading' typography='heading4'>${this.heading}</mo-heading>`}
					</slot>

					<slot name='subHeading'>
						${!this.subHeading ? nothing : html`<mo-heading part='subHeading' typography='heading6' foreground='var(--mo-color-gray)'>${this.subHeading}</mo-heading>`}
					</slot>
				</mo-flex>
				<slot name='action'></slot>
			</slot>
		`
	}

	protected get mediaTemplate() {
		const hasMedia = !!this.image || this.hasSlottedChildren('media')
		return !hasMedia ? nothing : html`
			<slot part='media' name='media'>
				${!this.image ? nothing : html`<img part='media' src=${this.image} />`}
			</slot>
		`
	}

	protected get bodyTemplate() {
		this.switchAttribute('hasBody', this.hasSlottedChildren(''))
		return html`<slot></slot>`
	}

	protected get footerTemplate() {
		return !this.hasSlottedChildren('footer') ? nothing : html`<slot part='footer' name='footer'></slot>`
	}

	private hasSlottedChildren(slot: string) {
		return Array.from(this.childNodes)
			.filter(node => node.nodeType <= 2 || (node.nodeType === 3 && !!node.textContent?.trim()))
			.flatMap(child => child instanceof HTMLSlotElement ? child.assignedElements() : [child])
			.some(child => (child instanceof HTMLElement && child.slot === slot) || (!slot && (child instanceof HTMLElement) === false))
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-card': Card
	}
}