import { component, property, ComponentMixin, PropertyValues } from '../../library'
import { TextContentController } from '../../utilities'
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

	protected readonly textContentController = new TextContentController(this, textContent => {
		this.label = textContent
		this.extended = !!textContent
	})

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.switchAttribute('mo-fab', true)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-fab': Fab
	}
}