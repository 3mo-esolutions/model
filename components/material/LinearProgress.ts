import { component, ComponentMixin } from '../../library'
import { LinearProgress as MwcLinearProgress } from '@material/mwc-linear-progress'

/**
 * @attr indeterminate
 * @attr progress
 * @attr buffer
 * @attr reverse
 * @attr close
 */
@component('mo-linear-progress')
export default class LinearProgress extends ComponentMixin(MwcLinearProgress) { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-linear-progress': LinearProgress
	}
}