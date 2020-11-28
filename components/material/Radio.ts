import { component, property, componentize, InputElement } from '../../library'
import { Radio as MwcRadio } from '@material/mwc-radio'
import { labelize } from './labelize'

/**
 * @attr disabled
 * @attr name
 * @attr global
 */
@component('mo-radio')
export default class Radio extends labelize(componentize(MwcRadio)) implements InputElement<boolean> {
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