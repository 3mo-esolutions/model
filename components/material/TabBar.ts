import { component, property, ComponentMixin, event } from '../../library'
import { TabBar as MwcTabBar } from '@material/mwc-tab-bar'
import { Tab } from '.'

/**
 * @attr activeIndex
 * @fires navigate
 */
@component('mo-tab-bar')
export class TabBar extends ComponentMixin(MwcTabBar) {
	@event() readonly navigate!: IEvent<string | undefined>

	@property({ observer: valueChanged }) value?: string

	@property({ type: Boolean }) preventFirstTabNavigation = false

	get tabs() {
		return Array.from(this.children).filter(c => c instanceof Tab) as Array<Tab>
	}

	get activeTab() {
		return this.tabs.find(tab => tab.active)
	}

	get selectedTab() {
		return this.tabs.find(tab => tab.value === this.value)
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

			this.navigate.dispatch(this.activeTab?.value)
		})
	}

	async updateTabs() {
		this.activeIndex = this.tabs.findIndex(tab => tab.value === this.value)
		await Promise.all(this.tabs.map(tab => tab.updateComplete))
		this.tabs.forEach(tab => tab.deactivate())
		this.selectedTab?.activate({} as ClientRect)
	}

	protected initialized() {
		this.tabsSlot.addEventListener('slotchange', () => {
			this.value = this.value ?? this.getAttribute('value') ?? undefined
			valueChanged.call(this)
		})
	}
}

async function valueChanged(this: TabBar) {
	await this.updateTabs()
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-tab-bar': TabBar
	}
}