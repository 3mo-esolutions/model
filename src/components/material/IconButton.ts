import { component, property, ComponentMixin, css } from '../../library'
import { MaterialIcon } from '../../types'
import { IconButton as MwcIconButton } from '@material/mwc-icon-button'

/**
 * @attr icon
 * @attr label
 * @attr disabled
 */
@component('mo-icon-button')
export class IconButton extends ComponentMixin(MwcIconButton) {
	@property() override icon!: MaterialIcon

	@property({ type: Boolean, reflect: true }) small = false

	@property()
	override get fontSize() { return super.fontSize }
	override set fontSize(value) {
		super.fontSize = value
		this.style.setProperty('--mdc-icon-size', value)
	}

	protected override initialized() {
		this.buttonElement.setAttribute('part', 'button')
	}

	static override get styles() {
		return css`
			${super.styles}

			:host {
				--mdc-icon-size: var(--mo-font-size-icon, 20px);
				--mdc-icon-button-size: calc(var(--mdc-icon-size) * 2);
			}

			:host([small]) {
				--mdc-icon-button-size: calc(var(--mdc-icon-size) * 1.5);
			}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-icon-button': IconButton
	}
}