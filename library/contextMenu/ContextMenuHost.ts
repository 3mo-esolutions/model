import { Component, component, html, nothing, property, query, TemplateResult } from '..'
import { Menu } from '../../components'

@component('mo-context-menu-host')
export class ContextMenuHost extends Component {
	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-context-menu-host') as ContextMenuHost }
	static get openMenu() { return this.instance.openMenu.bind(this.instance) }

	private readonly lengthBuffer = 16

	@property({ type: Object }) menu?: TemplateResult

	async openMenu(mouseEvent: MouseEvent, template: TemplateResult) {
		this.menu = template

		if (this.list) {
			this.list.style.opacity = '0'
			await PromiseTask.sleep(1)

			const x = (mouseEvent.clientX + this.list.offsetWidth + this.lengthBuffer > window.innerWidth)
				? window.innerWidth - this.list.offsetWidth - this.lengthBuffer
				: mouseEvent.clientX
			const y = (mouseEvent.clientY + this.list.offsetHeight + this.lengthBuffer > window.innerHeight)
				? window.innerHeight - this.list.offsetHeight - this.lengthBuffer
				: mouseEvent.clientY

			this.list.style.left = `${x}px`
			this.list.style.top = `${y}px`
			this.list.style.opacity = '1'
		}
	}

	@query('mo-menu') private readonly menuContext!: Menu

	get list() {
		return this.menuContext.shadowRoot?.querySelector('mwc-menu-surface')?.shadowRoot?.querySelector('div') ?? undefined
	}

	protected render = () => html`
		<style>
			mo-menu {
				--mdc-menu-z-index: 10;
				--mdc-menu-item-height: var(--mo-elm-height-s);
				--mo-list-item-icon-color: var(--mo-color-gray);
			}

			::slotted(mo-context-menu-item) {
				font-size: var(--mo-font-size-l);
			}

			/* NOTE: Material Design's Dialog scans the root elements and 'inert's them.
				This is ok as long as our root-level elements do not need any focus-related behaviours
				Which is the case here unfortunately. This code snippet overwrites the effect of 'inert' attribute
				so that the context menu is always focusable.
				More to inert that MWC uses: https://github.com/WICG/inert
			*/
			:host([inert]) {
				pointer-events: auto !important;
				cursor: default !important;
				user-select: auto !important;
				-webkit-user-select: auto !important;
				-moz-user-select: auto !important;
				-ms-user-select: auto !important;
			}
		</style>
		<mo-menu x='0' y='0' fixed quick .anchor=${document.body} ?open=${!!this.menu} @closed=${() => this.menu = undefined}>
			${this.menu ?? nothing}
		</mo-menu>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu-host': ContextMenuHost
	}
}