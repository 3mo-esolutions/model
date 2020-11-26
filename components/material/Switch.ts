import { component, property, componentize, InputElement } from '../../library'
import { Switch as MwcSwitch } from '@material/mwc-switch'
import { labelize } from './labelize'

/**
 * @attr checked
 * @attr disabled
 * @fires change
 */
@component('mdc-switch')
export default class Switch extends labelize(componentize(MwcSwitch)) implements InputElement<boolean> {
	@property({ type: Boolean })
	// @ts-ignore overriding the value property
	get value(): boolean { this.checked === true }
	set value(value: boolean) { this.checked = value }
}