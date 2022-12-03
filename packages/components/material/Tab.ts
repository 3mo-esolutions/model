import { component, property, css } from '@a11d/lit'
import { ComponentMixin } from '../../library'
import { MaterialIcon } from '..'
import { MutationController } from '@3mo/mutation-observer'
import { Tab as MwcTab } from '@material/mwc-tab'

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
export class Tab extends ComponentMixin(MwcTab) {
	@property({ reflect: true }) value!: string
	@property({ reflect: true }) override icon!: MaterialIcon

	protected readonly mutationController = new MutationController(this, {
		config: {
			subtree: true,
			characterData: true,
			childList: true,
		},
		callback: () => this.label = this.textContent || ''
	})

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mdc-tab-color-default: var(--mo-color-foreground-transparent);
					--mdc-tab-text-label-color-default: var(--mo-color-foreground-transparent);
				}
			`
		]
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-tab': Tab
	}
}