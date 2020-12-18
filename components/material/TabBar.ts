import { component, property, ComponentMixin } from '../../library'
import { TabBar as MwcTabBar } from '@material/mwc-tab-bar'
import { Tab } from '.'

/**
 * @attr activeIndex
 * @fires MDCTabBar:activated
 */
@component('mo-tab-bar')
export default class TabBar<TValue extends string> extends ComponentMixin(MwcTabBar) {
	get tabs() { return Array.from(this.children) as Array<Tab<TValue>> }

	get selectedTab() { return this.tabs.find(tab => tab.active) }

	@property()
	get value() { return this.tabs[this.activeIndex].value }
	set value(value) { this.activeIndex = this.tabs.findIndex(tab => tab.getAttribute('value') === value) }

	@property({ type: Boolean }) preventFirstTabNavigation = false

	private isFirstNavigation = true

	constructor() {
		super()
		this.addEventListener('MDCTabBar:activated', e => {
			if (this.isFirstNavigation && this.preventFirstTabNavigation) {
				this.isFirstNavigation = false
				e.stopImmediatePropagation()
			}
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-tab-bar': TabBar<string>
	}
}