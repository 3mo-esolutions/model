import { component, property, componentize } from '../../library'
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
export default class Tab extends componentize(MwcTabWithCompatibleMinWidth) {
	@property({ reflect: true }) value?: string
	@property({ reflect: true }) icon!: MaterialIcon
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-tab': Tab
	}
}