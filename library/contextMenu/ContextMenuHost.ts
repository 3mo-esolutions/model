import { Component, component, html, property, query } from '..'
import { PromiseTask } from '../../helpers'
import { Menu } from '../../components'

@component('mo-context-menu-host')
export default class ContextMenuHolder extends Component {
	static get instance() { return MoDeL.applicationHost.shadowRoot.querySelector('mo-context-menu-host') as ContextMenuHolder }
	static get openMenu() { return this.instance.openMenu.bind(this.instance) }

	private readonly lengthBuffer = 16

	@property({ type: Array })
	menuItems = new Array<HTMLElement>()

	async openMenu(mouseEvent: MouseEvent, menuItems: Array<HTMLElement>) {
		this.isOpen = false

		// FIX clone causes RIPPLE effect not to work
		this.menuItems = menuItems.map(item => item.clone())

		if (this.list) {
			this.list.style.opacity = '0'
			this.isOpen = true
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

	private set isOpen(value: boolean) {
		this.menuContext.open = value
		if (value === false) {
			this.menuItems = new Array<HTMLElement>()
		}
	}

	protected initialized() {
		super.initialized()
		this.isOpen = false

		this.menuContext.x = 0
		this.menuContext.y = 0
		this.menuContext.anchor = document.body
		this.menuContext.addEventListener('closed', () => this.isOpen = false)
	}

	protected render() {
		return html`
			<style>
				mo-menu {
					--mdc-menu-z-index: 10;
					--mdc-menu-item-height: var(--mo-elm-height-s);
				}

				::slotted(mo-context-menu-item) {
					font-size: var(--mo-fontsize-d);
				}
			</style>
			<mo-menu fixed quick @click=${() => this.isOpen = false}>
				${this.menuItems}
			</mo-menu>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu-host': ContextMenuHolder
	}
}