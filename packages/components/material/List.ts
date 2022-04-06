import { component, property, event, ComponentMixin } from '../../library'
import { List as MwcList, MWCListIndex } from '@material/mwc-list'

type ListValue = string | Array<string>

/**
 * @attr activatable
 * @attr rootTabbable
 * @attr multi
 * @attr wrapFocus
 * @attr itemRoles
 * @attr innerRole
 * @attr noninteractive
 * @attr innerRole
 * @fires action {CustomEvent<{ index: number }>}
 * @fires selected {CustomEvent<SelectedDetail>}
 * @fires change {CustomEvent<ListValue | undefined>}
 */
@component('mo-list')
export class List extends ComponentMixin(MwcList) {
	@event() private readonly change!: EventDispatcher<ListValue | undefined>

	@property({
		reflect: true,
		updated(this: List) {
			if (!this.value) {
				return
			}

			const index = this.value instanceof Array
				? new Set(this.value.map(v => this.items.findIndex(item => item.value === v)))
				: this.items.findIndex(i => i.value === this.value)
			this.select(index)
		}
	}) value?: ListValue

	constructor() {
		super()
		this.addEventListener<any>('selected', (e: CustomEvent<{ index: MWCListIndex }>) => {
			const index = e.detail.index
			const value = index instanceof Set
				? this.items.filter((_, i) => index.has(i)).map(item => item.value)
				: this.items[index]?.value || undefined
			this.value = value
			this.change.dispatch(value)
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-list': List
	}
}