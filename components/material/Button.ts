import { component, property, ComponentMixin } from '../../library'
import { Button as MwcButton } from '@material/mwc-button'
import { MaterialIcon } from '../../types'

/**
 * @attr icon
 * @attr label
 * @attr raised
 * @attr unelevated
 * @attr outlined
 * @attr dense
 * @attr disabled
 * @attr trailingIcon
 * @slot icon
 * @slot trailingIcon
 */
@component('mo-button')
export default class Button extends ComponentMixin(MwcButton) {
	@property() icon!: MaterialIcon
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-button': Button
	}
}