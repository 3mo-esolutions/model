import { component, ComponentMixin } from '../../library'
// eslint-disable-next-line import/no-internal-modules
import { CheckListItem as MwcCheckListItem } from '@material/mwc-list/mwc-check-list-item'

/**
 * @attr left
 * @attr group
 * @attr value
 * @attr group
 * @attr disabled
 * @attr activated
 * @attr noninteractive
 * @attr selected
 * @fires selectionChange
 */
@component('mo-list-item-checkbox')
export default class ListItemCheckbox extends ComponentMixin(MwcCheckListItem) {
	@eventProperty readonly selectionChange!: IEvent<boolean>

	constructor() {
		super()
		this.hasMeta = !!Array.from(this.children).find(child => child.slot === 'meta')
		this.twoline = !!Array.from(this.children).find(child => child.slot === 'secondary')
		this.addEventListener('request-selected', (e: CustomEvent<{ selected: boolean }>) => this.selectionChange.trigger(e.detail.selected))
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-list-item-checkbox': ListItemCheckbox
	}
}