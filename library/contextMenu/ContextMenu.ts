import { Component, component } from '..'
import { ContextMenuHost } from '.'

@component('mo-context-menu')
export default class ContextMenu extends Component {
	protected initialized() {
		this.parentElement.addEventListener('contextmenu', (e: MouseEvent) => this.open(e))
	}

	open(mouseEvent: MouseEvent) {
		ContextMenuHost.openMenu(mouseEvent, this.childElements)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu': ContextMenu
	}
}