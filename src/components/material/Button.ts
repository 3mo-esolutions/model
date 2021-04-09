import { component, property, ComponentMixin, css } from '../../library'
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
export class Button extends ComponentMixin(MwcButton) {
	static get styles() {
		return css`
			${super.styles}

			button {
				margin: auto;
			}
		`
	}

	@property() icon!: MaterialIcon
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-button': Button
	}
}