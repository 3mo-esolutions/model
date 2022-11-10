import { component } from '@a11d/lit'
import { ComponentMixin } from '../../library'
import { ListItemMixin } from '../helpers'
import { RadioListItem as MwcRadioListItem } from '@material/mwc-list/mwc-radio-list-item'

class MwcRadioListItemWidthCompatibleLeft extends MwcRadioListItem {
	// @ts-expect-error It is actually a boolean
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
@component('mo-list-item-radio')
export class ListItemRadio extends ComponentMixin(ListItemMixin(MwcRadioListItemWidthCompatibleLeft)) {
	constructor() {
		super()
		this.addEventListener('request-selected', () => this.selectionChange.dispatch(this.radioElement.checked))
		this.addEventListener('click', () => this.radioElement.checked = !this.radioElement.checked)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-list-item-radio': ListItemRadio
	}
}