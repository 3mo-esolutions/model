import { component, property, ComponentMixin } from '../../library'
import { TabBar as MwcTabBar } from '@material/mwc-tab-bar'
import { Tab } from '.'

/**
 * @attr activeIndex
 * @fires navigate
 */
@component('mo-tab-bar')
export default class TabBar extends ComponentMixin(MwcTabBar) {
	@eventProperty() readonly navigate!: IEvent<string>

	@property()
	get value() { return this.tabs[this.activeIndex]?.value }
	set value(value) { this.activeIndex = this.tabs.findIndex(tab => tab.getAttribute('value') === value) }

	@property({ type: Boolean }) preventFirstTabNavigation = false

	get tabs() {
		return Array.from(this.children).filter(c => c instanceof Tab) as Array<Tab>
	}

	get selectedTab() {
		return this.tabs.find(tab => tab.active)
	}

	private isFirstNavigation = true

	constructor() {
		super()
		this.addEventListener('MDCTabBar:activated', e => {
			if (this.isFirstNavigation && this.preventFirstTabNavigation) {
				this.isFirstNavigation = false
				e.stopImmediatePropagation()
				return
			}

			this.navigate.trigger(this.value)
		})
	}

	protected initialized() {
		this.tabsSlot.addEventListener('slotchange', () => {
			const valueAttribute = this.getAttribute('value')
			if (!this.value && valueAttribute) {
				this.value = valueAttribute
			}
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-tab-bar': TabBar
	}
}