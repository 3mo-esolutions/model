import { component, property, ComponentMixin } from '../../library'
import { MaterialIcon, TextContentController } from '..'
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

	protected readonly textContentController = new TextContentController(this, textContent => {
		this.label = textContent
		this.extended = !!textContent
	})
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-fab': Fab
	}
}