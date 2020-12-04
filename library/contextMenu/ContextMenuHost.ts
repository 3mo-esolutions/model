import { Component, component, html, nothing, property, query, TemplateResult } from '..'
import { PromiseTask } from '../../helpers'
import { Menu } from '../../components'

@component('mo-context-menu-host')
export default class ContextMenuHolder extends Component {
	static get instance() { return MoDeL.applicationHost.shadowRoot.querySelector('mo-context-menu-host') as ContextMenuHolder }
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

	protected render() {
		return html`
			<style>
				mo-menu {
					--mdc-menu-z-index: 10;
					--mdc-menu-item-height: var(--mo-elm-height-s);
				}

				::slotted(mo-context-menu-item) {
					font-size: var(--mo-font-size-l);
				}
			</style>
			<mo-menu x='0' y='0' fixed quick .anchor=${document.body} ?open=${!!this.menu} @closed=${() => this.menu = undefined}>
				${this.menu ?? nothing}
			</mo-menu>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu-host': ContextMenuHolder
	}
}