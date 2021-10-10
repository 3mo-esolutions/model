import { component, property, ComponentMixin } from '../../library'
import { MaterialIcon } from '..'
import { Tab as MwcTab } from '@material/mwc-tab'

class MwcTabWithCompatibleMinWidth extends MwcTab {
	// @ts-ignore It is actually a boolean to resolve TS error
	minWidth: string
}

/**
 * @attr label
 * @attr hasImageIcon
 * @attr indicatorIcon
 * @attr isFadingIndicator
 * @attr stacked
 * @attr active
 * @fires MDCTab:interacted {CustomEvent<{ tabId: string }>}
 */
@component('mo-tab')
export class Tab extends ComponentMixin(MwcTabWithCompatibleMinWidth) {
	@property({ reflect: true }) value!: string
	@property({ reflect: true }) override icon!: MaterialIcon

	protected override initialized() {
		if (this.textContent) {
			this.label = this.textContent
		}
		new MutationObserver(() => this.label = this.textContent ?? '').observe(this, {
			subtree: true,
			characterData: true
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-tab': Tab
	}
}