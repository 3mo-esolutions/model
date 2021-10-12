import { component, property, ComponentMixin, css } from '../../library'
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
		return css`
			${super.styles}

			.mdc-switch {
				margin-right: 6px;
			}
		`
	}

	@property({ type: Boolean })
	get value() { return this.checked === true }
	set value(value) { this.checked = value }
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-switch': Switch
	}
}