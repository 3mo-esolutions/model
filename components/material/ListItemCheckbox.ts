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
 * @fires request-selected
 */
@component('mo-list-item-checkbox')
export default class ListItemCheckbox extends ComponentMixin(MwcCheckListItem) { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-list-item-checkbox': ListItemCheckbox
	}
}