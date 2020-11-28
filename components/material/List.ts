import { component, componentize } from '../../library'
import { List as MwcList } from '@material/mwc-list'

/**
 * @attr activatable
 * @attr rootTabbable
 * @attr multi
 * @attr wrapFocus
 * @attr itemRoles
 * @attr innerRole
 * @attr noninteractive
 * @attr innerRole
 * @fires action
 * @fires selected
 */
@component('mo-list')
export default class List extends componentize(MwcList) { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-list': List
	}
}