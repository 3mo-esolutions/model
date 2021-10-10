import { component, property, ComponentMixin } from '../../library'
import { LabelMixin, InputMixin } from '..'
import { Radio as MwcRadio } from '@material/mwc-radio'

/**
 * @attr disabled
 * @attr name
 * @attr global
 */
@component('mo-radio')
export class Radio extends InputMixin(LabelMixin(ComponentMixin(MwcRadio))) {
	@property({ type: Boolean })
	// @ts-ignore overriding the value property
	get value(): boolean { return this.checked }
	// @ts-ignore overriding the value property
	set value(value: boolean) { this.checked = value }
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-radio': Radio
	}
}