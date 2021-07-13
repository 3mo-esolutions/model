import { component, css } from '..'
import { ListItem } from '../../components'

@component('mo-context-menu-item')
export class ContextMenuItem extends ListItem {
	static override get styles() {
		return [
			...super.styles,
			css`
				:host([disabled]) {
					color: var(--mo-color-gray);
				}
			`
		]
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu-item': ContextMenuItem
	}
}