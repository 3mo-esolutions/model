import { component, ComponentMixin } from '../../library'
// eslint-disable-next-line import/no-internal-modules
import { RadioListItem as MwcRadioListItem } from '@material/mwc-list/mwc-radio-list-item'

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
@component('mo-list-item-radio')
export default class ListItemRadio extends ComponentMixin(MwcRadioListItem) { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-item-item': ListItemRadio
	}
}