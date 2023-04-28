import { component } from '@a11d/lit'
import { Menu } from '@3mo/menu'

@component('mo-context-menu')
export class ContextMenu extends Menu { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu': ContextMenu
	}
}