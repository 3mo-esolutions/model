import { component, property, ComponentMixin } from '../../library'
import { Tab as MwcTab } from '@material/mwc-tab'
import { MaterialIcon } from '../../types'

class MwcTabWithCompatibleMinWidth extends MwcTab {
	// @ts-ignore It is actually a boolean to resolve TS error
	minWidth: number
}

/**
 * @attr label
 * @attr hasImageIcon
 * @attr indicatorIcon
 * @attr isFadingIndicator
 * @attr stacked
 * @attr active
 * @fires MDCTab:interacted
 */
@component('mo-tab')
export default class Tab<TValue extends string> extends ComponentMixin(MwcTabWithCompatibleMinWidth) {
	@property({ reflect: true }) value?: TValue
	@property({ reflect: true }) icon!: MaterialIcon

	initialized() {
		if (this.textContent) {
			this.label = this.textContent
		}
		// if(this.textContent)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-tab': Tab<string>
	}
}