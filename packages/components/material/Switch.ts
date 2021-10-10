import { component, property, ComponentMixin } from '../../library'
import { LabelMixin, InputMixin } from '..'
import { Switch as MwcSwitch } from '@material/mwc-switch'

/**
 * @attr checked
 * @attr disabled
 * @fires change {CustomEvent}
 */
@component('mo-switch')
export class Switch extends InputMixin(LabelMixin(ComponentMixin(MwcSwitch))) {
	@property({ type: Boolean })
	get value() { return this.checked === true }
	set value(value) { this.checked = value }
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-switch': Switch
	}
}