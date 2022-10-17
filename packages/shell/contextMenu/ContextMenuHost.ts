import { Component, component, html, nothing, property, query, TemplateResult, queryAll, css, TemplateHelper } from '../../library'
import { Corner } from '@material/mwc-menu'
import { ContextMenu, ListItem } from '../..'
import { nonInertable } from '..'

type Coordinates = [x: number, y: number]
type MouseEventOpenArguments = [mouseEvent: MouseEvent, template: TemplateResult]
type CoordinatesOpenArguments = [coordinates: Coordinates, template: TemplateResult]
type RelativeElementOpenArguments = [relativeElement: HTMLElement, corner: Corner, template: TemplateResult]
type OpenArguments =
	| MouseEventOpenArguments
	| CoordinatesOpenArguments
	| RelativeElementOpenArguments

@component('mo-context-menu-host')
@nonInertable()
export class ContextMenuHost extends Component {
	private static readonly lengthBuffer = 16

	static get instance() { return MoDeL.application.renderRoot.querySelector('mo-context-menu-host') as ContextMenuHost }
	static get open() { return this.instance.open }
	static get close() { return this.instance.close }
	static get contextMenu() { return this.instance.contextMenu }

	@property({ type: Object }) menuContent?: TemplateResult

	@queryAll('[mwc-list-item]') readonly items!: Array<ListItem>

	@query('mo-context-menu') private readonly contextMenu!: ContextMenu

	open = (...args: OpenArguments) => {
		switch (true) {
			case args[0] instanceof MouseEvent:
				return this.openByMouseEvent(...args as MouseEventOpenArguments)
			case args[0] instanceof HTMLElement:
				return this.openByRelativeElement(...args as RelativeElementOpenArguments)
			case args[0] instanceof Array:
				return this.openByCoordinates(...args as CoordinatesOpenArguments)
			default:
				throw new TypeError('Invalid arguments')
		}

	}

	close = async () => {
		this.menuContent = undefined
		await this.updateComplete
	}

	private openByMouseEvent(mouseEvent: MouseEvent, template: TemplateResult) {
		mouseEvent.preventDefault()
		return this.openByCoordinates([mouseEvent.clientX, mouseEvent.clientY], template)
	}

	private async openByCoordinates(coordinates: Coordinates, template: TemplateResult) {
		if (TemplateHelper.isEmpty(template)) {
			return
		}

		const [x, y] = coordinates
		this.contextMenu.anchor = null
		this.menuContent = template
		if (this.list) {
			this.list.style.opacity = '0'
			await Promise.sleep(1)

			const finalX = (x + this.list.offsetWidth + ContextMenuHost.lengthBuffer > window.innerWidth)
				? window.innerWidth - this.list.offsetWidth - ContextMenuHost.lengthBuffer
				: x
			const finalY = (y + this.list.offsetHeight + ContextMenuHost.lengthBuffer > window.innerHeight)
				? window.innerHeight - this.list.offsetHeight - ContextMenuHost.lengthBuffer
				: y

			this.list.style.left = `${finalX}px`
			this.list.style.top = `${finalY}px`
			this.list.style.opacity = '1'

			await this.updateComplete
		}
	}

	private async openByRelativeElement(element: HTMLElement, corner: Corner, template: TemplateResult) {
		if (TemplateHelper.isEmpty(template)) {
			return
		}
		this.contextMenu.corner = corner
		this.contextMenu.anchor = element
		this.menuContent = template
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