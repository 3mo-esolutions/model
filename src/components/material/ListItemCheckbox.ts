import { component, ComponentMixin, event } from '../../library'
import { ListItemMixin } from './ListItemMixin'
// eslint-disable-next-line import/no-internal-modules
import { CheckListItem as MwcCheckListItem } from '@material/mwc-list/mwc-check-list-item'

class MwcCheckListItemWidthCompatibleLeft extends MwcCheckListItem {
	// @ts-ignore It is actually a boolean
	left: string
}

/**
 * @attr left
 * @attr group
 * @attr value
 * @attr group
 * @attr disabled
 * @attr activated
 * @attr noninteractive
 * @attr selected
 * @attr hasMeta
 * @attr graphic
 * @attr twoline
 * @fires selectionChange {CustomEvent<RequestSelectedDetail>}
 */
@component('mo-list-item-checkbox')
export class ListItemCheckbox extends ComponentMixin(ListItemMixin(MwcCheckListItemWidthCompatibleLeft)) {
	@event() override readonly selectionChange!: EventDispatcher<boolean>

	constructor() {
		super()
		this.addEventListener('request-selected', () => this.selectionChange.dispatch(this.checkboxElement.checked))
		this.addEventListener('click', () => this.checkboxElement.checked = !this.checkboxElement.checked)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-list-item-checkbox': ListItemCheckbox
	}
}