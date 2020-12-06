import { component, property, ComponentMixin } from '../../library'
import { Switch as MwcSwitch } from '@material/mwc-switch'
import { LabelMixin } from './LabelMixin'
import { InputMixin } from './InputMixin'

/**
 * @attr checked
 * @attr disabled
 * @fires change
 */
@component('mo-switch')
export default class Switch extends InputMixin(LabelMixin(ComponentMixin(MwcSwitch))) {
	@property({ type: Boolean })
	get value() { return this.checked === true }
	set value(value) { this.checked = value }
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-switch': Switch
	}
}