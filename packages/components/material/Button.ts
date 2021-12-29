import { component, property, css, PropertyValues, ComponentMixin } from '../../library'
import { Button as MwcButton } from '@material/mwc-button'
import { MaterialIcon } from '..'

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
		return [
			...super.styles,
			css`
				:host {
					height: 36px;
					line-height: normal;
				}

				button {
					margin: auto;
					height: 100% !important;
				}
			`
		]
	}

	@property() override icon!: MaterialIcon

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.buttonElement.setAttribute('part', 'button')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-button': Button
	}
}