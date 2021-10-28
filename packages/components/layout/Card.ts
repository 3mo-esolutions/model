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
				max-height: var(--mo-card-header-max-height, 30px);
				align-items: center;
			}

			slot[name=heading] {
				display: block;
				flex: 1;
			}

			slot[name=media] img, slot[name=media]::slotted(img) {
				display: block;
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center center;
				width: 100%;
				object-fit: cover;
			}

			slot:not([name]) {
				display: block;
				padding: var(--mo-card-body-padding, 16px);
				flex: 1;
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
				${this.headerTemplate}
				${this.mediaTemplate}
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
		const hasMedia = this.image || this.hasSlottedChildren('media')
		return !hasMedia ? nothing : html`
			<slot part='media' name='media'>
				${!this.image ? nothing : html`<img part='media' src=${this.image} />`}
			</slot>
		`
	}

	protected get bodyTemplate() {
		return html`<slot></slot>`
	}

	protected get footerTemplate() {
		return !this.hasSlottedChildren('footer') ? nothing : html`<slot part='footer' name='footer'></slot>`
	}

	private hasSlottedChildren(slot: string) {
		return Array.from(this.children)
			.flatMap(child => child instanceof HTMLSlotElement ? child.assignedElements() : [child])
			.some(child => child.slot === slot)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-card': Card
	}
}