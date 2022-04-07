import { component, css, property, ComponentMixin } from '../../library'
import { ListItemMixin } from '..'
import { ListItem as MwcListItem } from '@material/mwc-list/mwc-list-item'

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
		updated(this: ListItem) {
			if (this.nonActivatable === true) {
				this.disabled = true
			}
		}
	}) nonActivatable = false

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mdc-list-item-graphic-margin: 12px;
				}

				:host([disabled][nonActivatable]) {
					cursor: pointer;
					pointer-events: auto;
				}
			`
		] as any
	}

	constructor() {
		super()
		this.addEventListener<any>('request-selected', (e: CustomEvent<{ readonly selected: boolean }>) => {
			if (this.selected !== e.detail.selected) {
				this.selectionChange.dispatch(e.detail.selected)
			}
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-list-item': ListItem
	}
}