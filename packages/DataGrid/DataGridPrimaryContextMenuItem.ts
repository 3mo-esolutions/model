import { component, css } from '@a11d/lit'
import { ContextMenuItem } from '../ContextMenu'

@component('mo-data-grid-primary-context-menu-item')
export class DataGridPrimaryContextMenuItem extends ContextMenuItem {
	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					font-weight: bold;
				}
			`
		]
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-primary-context-menu-item': DataGridPrimaryContextMenuItem
	}
}