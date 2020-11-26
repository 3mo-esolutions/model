import { Component, component } from '..'
import { ContextMenuHost } from '.'

@component('mdc-context-menu')
export default class ContextMenu extends Component {
	protected initialized() {
		this.parentElement.addEventListener('contextmenu', (e: MouseEvent) => this.open(e))
	}

	open(mouseEvent: MouseEvent) {
		ContextMenuHost.openMenu(mouseEvent, this.childElements)
	}
}