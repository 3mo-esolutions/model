import { component, property, css, event } from '@a11d/lit'
import { CheckListItem as MwcCheckListItem } from '@material/mwc-list/mwc-check-list-item'
import { ComponentMixin } from '../../../library'
import { ListItemMixin } from '../..'

class MwcCheckListItemWidthCompatibleLeft extends MwcCheckListItem {
	// @ts-expect-error 'left' shall be overwritten 'MwcCheckListItem'.
	override left: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseClass = ComponentMixin(ListItemMixin(MwcCheckListItemWidthCompatibleLeft))

@component('mo-option')
export class Option<TData> extends BaseClass {
	@event() override readonly selectionChange!: EventDispatcher<boolean>

	@event({ bubbles: true }) private readonly defaultClick!: EventDispatcher

	@property({ type: Object }) data?: TData
	@property({ type: Boolean, reflect: true }) multiple = false
	@property() inputText?: string
	@property({
		type: Boolean,
		reflect: true,
		updated(this: Option<TData>) {
			if (!this.default) {
				return
			}

			this.data = undefined
			this.value = undefined!
			this.disabled = true
		}
	}) default = false

	override get text() {
		return this.inputText ?? super.text
	}

	constructor() {
		super()
		this.addEventListener('request-selected', () => this.selectionChange.dispatch(this.checkboxElement.checked))
		this.addEventListener('click', () => this.checkboxElement.checked = !this.checkboxElement.checked)
	}

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mdc-checkbox-unchecked-color: var(--mo-color-foreground-transparent);
				}
			`,
			css`
				:host(:not([multiple])) .mdc-deprecated-list-item__meta {
					display: none;
				}

				:host([default]) {
					cursor: pointer;
					pointer-events: auto;
				}
			`
		] as any
	}

	protected override initialized() {
		super.initialized()
		if (!this.value) {
			this.value = this.textContent || Array.from(this.parentElement?.children ?? []).indexOf(this).toString()
		}
		this.onclick = () => {
			if (this.default) {
				this.defaultClick.dispatch()
			}
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-option': Option<unknown>
	}
}