import { component, property, ComponentMixin } from '../../library'
import { MaterialIcon, TextContentController } from '..'
import { Tab as MwcTab } from '@material/mwc-tab'

class MwcTabWithCompatibleMinWidth extends MwcTab {
	// @ts-expect-error It is actually a boolean to resolve TS error
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
	protected readonly textContentController = new TextContentController(this, textContent => this.label = textContent)
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-tab': Tab
	}
}