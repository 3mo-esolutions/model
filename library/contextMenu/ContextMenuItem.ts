import { component } from '..'
import { ListItem } from '../../components'

@component('mo-context-menu-item')
export default class ContextMenuItem extends ListItem { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu-item': ContextMenuItem
	}
}