import { component, ComponentMixin, css } from '../../library'
import { LabelMixin, InputMixin } from '..'
import { Switch as MwcSwitch } from '@material/mwc-switch'

/**
 * @attr checked
 * @attr disabled
 * @fires change {CustomEvent}
 */
@component('mo-switch')
export class Switch extends InputMixin(LabelMixin(ComponentMixin(MwcSwitch))) {
	static override get styles() {
		return [
			...super.styles,
			css`
				.mdc-switch:enabled .mdc-switch__track::before {
					background: var(--mo-color-foreground-transparent);
				}

				.mdc-switch:enabled:not(:focus):not(:active) .mdc-switch__track::after {
					background: var(--mo-accent-gradient-transparent);
				}

				.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after {
					background: var(--mo-accent-gradient-transparent);
				}

				.mdc-switch {
					margin-right: 6px;
				}
			`
		]
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-switch': Switch
	}
}