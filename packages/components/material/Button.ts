import { component, property, css, PropertyValues, ComponentMixin } from '../../library'
import { Button as MwcButton } from '@material/mwc-button'
import { MaterialIcon } from '..'

export const enum ButtonType {
	Normal = 'normal',
	Outlined = 'outlined',
	Raised = 'raised',
	Unelevated = 'unelevated',
}

/**
 * @attr icon
 * @attr label
 * @attr dense
 * @attr disabled
 * @attr trailingIcon
 * @slot
 * @slot icon
 * @slot trailingIcon
 */
@component('mo-button')
export class Button extends ComponentMixin(MwcButton) {
	@property({
		updated(this: Button) {
			this.outlined = this.type === ButtonType.Outlined
			this.raised = this.type === ButtonType.Raised
			this.unelevated = this.type === ButtonType.Unelevated
		}
	}) type = ButtonType.Normal

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					height: 36px;
					line-height: normal;
					--mdc-button-disabled-ink-color: var(--mo-color-gray-transparent);
					--mdc-button-outline-color: var(--mdc-theme-primary);
				}

				button {
					margin: auto;
					height: 100% !important;
					/* 64px is Material's default */
					min-width: var(--mo-button-min-width, 64px) !important;
				}

				.mdc-button .mdc-button__icon {
					/* 8px is Material's default */
					margin-right: var(--mo-button-icon-margin-right, 8px) !important;
				}
			`
		]
	}

	// @ts-expect-error Icon is nullable and not always set
	@property() override icon?: MaterialIcon

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