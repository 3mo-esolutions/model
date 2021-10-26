import { component, html, property, Component, css, nothing } from '../../library'

/**
 * @slot headerAction - Actions in the header bar
 * @slot heading - Custom heading in the header
 * @slot subHeading - Custom subHeading in the header
 * @slot avatar - Custom avatar in the header
 * @slot media - Embedded media
 * @slot - Body / Content
 * @slot action - Actions in the footer bar
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

			slot[name=action] {
				display: block;
				padding: 8px;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex height='100%' width='100%'>
				${this.headerTemplate}
				${this.mediaTemplate}
				${this.bodyTemplate}
				${this.actionsTemplate}
			</mo-flex>
		`
	}

	protected get headerTemplate() {
		const hasHeader = this.avatar || this.heading || this.subHeading
			|| this.hasSlottedChildren('avatar') || this.hasSlottedChildren('heading') || this.hasSlottedChildren('subHeading')
			|| this.hasSlottedChildren('header') || this.hasSlottedChildren('headerAction')

		return !hasHeader ? nothing : html`
			<mo-flex direction='horizontal' padding='16px' gap='var(--mo-thickness-m)'>
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
				<slot name='headerAction'></slot>
			</mo-flex>
		`
	}

	protected get mediaTemplate() {
		const hasMedia = this.image || this.hasSlottedChildren('media')
		return !hasMedia ? nothing : html`
			<slot name='media'>
				${!this.image ? nothing : html`<img part='media' src=${this.image} />`}
			</slot>
		`
	}

	protected get bodyTemplate() {
		return html`<slot></slot>`
	}

	protected get actionsTemplate() {
		return !this.hasSlottedChildren('action') ? nothing : html`<slot name='action'></slot>`
	}

	private hasSlottedChildren(slot: string) {
		return Array.from(this.children).some(child => child.slot === slot)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-card': Card
	}
}