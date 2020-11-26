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
@component('mdc-list')
export default class List extends componentize(MwcList) { }