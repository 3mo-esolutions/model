import { component, ComponentMixin } from '../../library'
import { ListItem as MwcListItem } from '@material/mwc-list/mwc-list-item'
import { ListItemMixin } from './ListItemMixin'

/**
 * @attr value
 * @attr group
 * @attr disabled
 * @attr activated
 * @attr noninteractive
 * @attr selected
 * @attr hasMeta
 * @attr graphic
 * @attr twoline
 * @fires selectionChange
 */
@component('mo-list-item')
export default class ListItem extends ComponentMixin(ListItemMixin(MwcListItem)) {
	constructor() {
		super()
		this.addEventListener('request-selected', (e: CustomEvent<{ selected: boolean }>) => this.selectionChange.trigger(e.detail.selected))
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-list-item': ListItem
	}
}