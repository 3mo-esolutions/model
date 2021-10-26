import { component, html, property, Component, css, nothing } from '../../library'

/**
 * @slot headerAction - Actions in the header bar
 * @slot headline - Custom headline in the header bar
 * @slot subHeadline - Custom subHeadline in the header bar
 * @slot avatar - Custom avatar in the header bar
 * @slot media - Embedded media
 * @slot - Body / Content
 * @slot action - Actions in the footer bar
 */
@component('mo-card')
export class Card extends Component {
	@property() headline?: string
	@property() subHeadline?: string
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
		const hasHeader = this.avatar || this.headline || this.subHeadline
			|| this.hasSlottedChildren('avatar') || this.hasSlottedChildren('headline') || this.hasSlottedChildren('subHeadline')
			|| this.hasSlottedChildren('header') || this.hasSlottedChildren('headerAction')

		return !hasHeader ? nothing : html`
			<mo-flex part='header' direction='horizontal' padding='16px' gap='var(--mo-thickness-m)'>
				<slot name='avatar'>
					${!this.avatar ? nothing : html`<mo-avatar part='avatar' margin='0 var(--mo-thickness-m) 0 0'>${this.avatar}</mo-avatar>`}
				</slot>

				<mo-flex justifyContent='space-around' width='*'>
					<slot name='headline'>
						${!this.headline ? nothing : html`<mo-headline part='headline' typography='headline4'>${this.headline}</mo-headline>`}
					</slot>

					<slot name='subHeadline'>
						${!this.subHeadline ? nothing : html`<mo-headline part='subHeadline' typography='headline6' foreground='var(--mo-color-gray)'>${this.subHeadline}</mo-headline>`}
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