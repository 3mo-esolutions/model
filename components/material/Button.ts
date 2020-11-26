import { component, property, componentize } from '../../library'
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
@component('mdc-button')
export default class Button extends componentize(MwcButton) {
	@property() icon!: MaterialIcon
}