import { component } from '..'
import { ListItem } from '../../components'

@component('mo-context-menu-item')
export class ContextMenuItem extends ListItem { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu-item': ContextMenuItem
	}
}