import { component, ComponentMixin } from '../../library'
import { ListItemMixin } from './ListItemMixin'
// eslint-disable-next-line import/no-internal-modules
import { RadioListItem as MwcRadioListItem } from '@material/mwc-list/mwc-radio-list-item'

class MwcRadioListItemWidthCompatibleLeft extends MwcRadioListItem {
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
 * @fires selectionChange
 */
@component('mo-list-item-radio')
export default class ListItemRadio extends ComponentMixin(ListItemMixin(MwcRadioListItemWidthCompatibleLeft)) {
	constructor() {
		super()
		this.addEventListener('request-selected', () => this.selectionChange.trigger(this.radioElement.checked))
		this.addEventListener('click', () => this.radioElement.checked = !this.radioElement.checked)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-list-item-radio': ListItemRadio
	}
}