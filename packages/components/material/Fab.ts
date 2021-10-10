import { component, property, ComponentMixin } from '../../library'
import { MaterialIcon } from '..'
import { Fab as MwcFab } from '@material/mwc-fab'

/**
 * @attr mini
 * @attr disabled
 * @attr extended
 * @attr showIconAtEnd
 * @attr icon
 * @attr label
 * @slot icon
 */
@component('mo-fab')
export class Fab extends ComponentMixin(MwcFab) {
	@property() override icon!: MaterialIcon

	constructor() {
		super()
		new MutationObserver(() => {
			if (this.textContent) {
				this.label = this.textContent
				this.extended = true
			}
		}).observe(this, {
			subtree: true,
			characterData: true,
			childList: true,
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-fab': Fab
	}
}