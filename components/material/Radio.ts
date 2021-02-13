import { component, property, ComponentMixin } from '../../library'
import { Radio as MwcRadio } from '@material/mwc-radio'
import { LabelMixin } from './LabelMixin'
import { InputMixin } from './InputMixin'

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