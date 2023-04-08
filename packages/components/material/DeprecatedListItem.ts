import { component, css, property } from '@a11d/lit'
import { ComponentMixin } from '../../library'
import { ListItemMixin } from '.'
import { ListItem as MwcListItem } from '@material/mwc-list/mwc-list-item'

/**
 * @element mo-deprecated-list-item
 *
 * @attr value
 * @attr icon
 * @attr group
 * @attr disabled
 * @attr activated
 * @attr noninteractive
 * @attr nonActivatable
 * @attr selected
 * @attr hasMeta
 * @attr graphic
 * @attr twoline
 *
 * @slot graphic
 * @slot meta
 * @slot - The primary content of the list item
 * @slot secondary
 *
 * @fires selectionChange {CustomEvent<RequestSelectedDetail>}
 */
@component('mo-deprecated-list-item')
export class DeprecatedListItem extends ComponentMixin(ListItemMixin(MwcListItem)) {
	@property({
		type: Boolean,
		reflect: true,
		updated(this: DeprecatedListItem) {
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
		]
	}

	constructor() {
		super()
		this.addEventListener<any>('request-selected', (e: CustomEvent<{ readonly selected: boolean }>) => {
			if (this.selected !== e.detail.selected) {
				this.selectionChange.dispatch(e.detail.selected)
			}
		})
	}

	protected override initialized() {
		this.renderRoot.querySelector('.mdc-deprecated-list-item__text')?.setAttribute('part', 'content')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-deprecated-list-item': DeprecatedListItem
	}
}