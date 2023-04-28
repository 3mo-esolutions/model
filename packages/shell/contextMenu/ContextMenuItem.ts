import { component } from '@a11d/lit'
import { ListItem } from '@3mo/list'

/** @element mo-context-menu-item */
@component('mo-context-menu-item')
export class ContextMenuItem extends ListItem { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu-item': ContextMenuItem
	}
}