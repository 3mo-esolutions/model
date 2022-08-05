import { Component, component, html, nothing, property, query, TemplateResult, queryAll, css } from '../../library'
import { Corner } from '@material/mwc-menu'
import { ContextMenu, ListItem } from '../..'
import { nonInertable } from '..'

@component('mo-context-menu-host')
@nonInertable()
export class ContextMenuHost extends Component {
	static get instance() { return MoDeL.application.renderRoot.querySelector('mo-context-menu-host') as ContextMenuHost }
	static get openMenu() { return this.instance.openMenu }
	static get openMenuOnElement() { return this.instance.openMenuOnElement }
	static get closeMenu() { return this.instance.closeMenu }
	static get contextMenu() { return this.instance.contextMenu }

	@property({ type: Object }) menuContent?: TemplateResult

	@queryAll('[mwc-list-item]') readonly items!: Array<ListItem>

	@query('mo-context-menu') private readonly contextMenu!: ContextMenu

	private readonly lengthBuffer = 16

	openMenu = async (mouseEvent: MouseEvent, template: TemplateResult) => {
		this.contextMenu.anchor = null
		this.menuContent = template

		if (this.list) {
			this.list.style.opacity = '0'
			await Promise.sleep(1)

			const x = (mouseEvent.clientX + this.list.offsetWidth + this.lengthBuffer > window.innerWidth)
				? window.innerWidth - this.list.offsetWidth - this.lengthBuffer
				: mouseEvent.clientX
			const y = (mouseEvent.clientY + this.list.offsetHeight + this.lengthBuffer > window.innerHeight)
				? window.innerHeight - this.list.offsetHeight - this.lengthBuffer
				: mouseEvent.clientY

			this.list.style.left = `${x}px`
			this.list.style.top = `${y}px`
			this.list.style.opacity = '1'

			await this.updateComplete
		}
	}

	openMenuOnElement = async (element: HTMLElement, corner: Corner, template: TemplateResult) => {
		this.contextMenu.corner = corner
		this.contextMenu.anchor = element
		this.menuContent = template
		await this.updateComplete
	}

	closeMenu = async () => {
		this.menuContent = undefined
		await this.updateComplete
	}

	get list() {
		return this.contextMenu.renderRoot.querySelector('mwc-menu-surface')?.renderRoot.querySelector('div') ?? undefined
	}

	static override get styles() {
		return css`
			:host {
				z-index: 10;
			}

			mo-context-menu {
				--mdc-menu-z-index: 10;
				--mdc-menu-item-height: 36px;
				--mo-list-item-icon-color: var(--mo-color-gray);
			}

			::slotted(mo-context-menu-item) {
				font-size: var(--mo-font-size-l);
			}
		`
	}

	protected override get template() {
		return html`
			<mo-context-menu fixed quick ?open=${!!this.menuContent} @closed=${() => this.menuContent = undefined}>
				${this.menuContent ?? nothing}
			</mo-context-menu>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu-host': ContextMenuHost
	}
}