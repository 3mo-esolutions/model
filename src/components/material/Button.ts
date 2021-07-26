import { component, property, ComponentMixin, css, PropertyValues } from '../../library'
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
 * @slot
 * @slot icon
 * @slot trailingIcon
 */
@component('mo-button')
export class Button extends ComponentMixin(MwcButton) {
	static override get styles() {
		return css`
			${super.styles}

			:host {
				height: 36px;
				line-height: normal;
			}

			button {
				margin: auto;
				height: 100% !important;
			}
		`
	}

	@property() override icon!: MaterialIcon

	protected firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.buttonElement.setAttribute('part', 'button')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-button': Button
	}
}