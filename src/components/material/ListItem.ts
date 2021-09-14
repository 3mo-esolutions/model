import { component, ComponentMixin, css, property } from '../../library'
import { ListItem as MwcListItem } from '@material/mwc-list/mwc-list-item'
import { ListItemMixin } from './ListItemMixin'

/**
 * @attr value
 * @attr group
 * @attr disabled
 * @attr activated
 * @attr noninteractive
 * @attr nonActivatable
 * @attr selected
 * @attr hasMeta
 * @attr graphic
 * @attr twoline
 * @fires selectionChange {CustomEvent<RequestSelectedDetail>}
 */
@component('mo-list-item')
export class ListItem extends ComponentMixin(ListItemMixin(MwcListItem)) {
	@property({
		type: Boolean,
		reflect: true,
		observer(this: ListItem) {
			if (this.nonActivatable === true) {
				this.disabled = true
			}
		}
	}) nonActivatable = false

	static override get styles() {
		return [
			...super.styles,
			css`
				:host([disabled][nonActivatable]) {
					cursor: pointer;
					pointer-events: auto;
				}
			`
		] as any
	}

	constructor() {
		super()
		this.addEventListener('request-selected', (e: CustomEvent<{ selected: boolean }>) => this.selectionChange.dispatch(e.detail.selected))
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-list-item': ListItem
	}
}