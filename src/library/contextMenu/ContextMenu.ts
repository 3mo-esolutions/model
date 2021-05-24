import { Component, component, html } from '..'
import { ContextMenuHost } from '.'

@component('mo-context-menu')
export class ContextMenu extends Component {
	protected initialized() {
		this.parentElement?.addEventListener('contextmenu', (e: MouseEvent) => this.open(e))
	}

	open(mouseEvent: MouseEvent) {
		ContextMenuHost.openMenu(mouseEvent, html`${this.childElements.map(element => element.clone())}`)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu': ContextMenu
	}
}