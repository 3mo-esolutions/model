import { component, html, property, Component, css, nothing } from '../../library'

/**
 * @slot headerAction - Actions in the header bar
 * @slot media - Embedded media
 * @slot - Body / Content
 * @slot action - Actions in the footer bar
 */
@component('mo-card')
export class Card extends Component {
	@property() header?: string
	@property() avatar?: string
	@property() subHeader?: string
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
		const hasHeader = this.avatar || this.header || this.subHeader
			|| this.hasSlottedChildren('header') || this.hasSlottedChildren('headerAction')

		return !hasHeader ? nothing : html`
			<mo-flex id='header' direction='horizontal' padding='16px' gap='var(--mo-thickness-m)'>
				${!this.avatar ? nothing : html`<mo-avatar margin='0 var(--mo-thickness-m) 0 0'>${this.avatar}</mo-avatar>`}
				<mo-flex justifyContent='space-around' width='*'>
					${!this.header ? nothing : html`<mo-headline part='header' typography='headline4'>${this.header}</mo-headline>`}
					${!this.subHeader ? nothing : html`<mo-headline part='subHeader' typography='headline6' foreground='var(--mo-color-gray)'>${this.subHeader}</mo-headline>`}
				</mo-flex>
				<slot name='headerAction'></slot>
			</mo-flex>
		`
	}

	protected get mediaTemplate() {
		const hasMedia = this.image || this.hasSlottedChildren('media')
		return !hasMedia ? nothing : html`
			<slot name='media'>
				${!this.image ? nothing : html`<img id='media' src=${this.image} />`}
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