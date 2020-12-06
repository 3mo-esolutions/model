import { component, property, ComponentMixin } from '../../library'
import { MaterialIcon } from '../../types'
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
export default class Fab extends ComponentMixin(MwcFab) {
	@property() icon!: MaterialIcon

	constructor() {
		super()
		if (this.innerText !== '') {
			this.label = this.innerText
			this.extended = true
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-fab': Fab
	}
}