import { component, property } from '@a11d/lit'
import { ComponentMixin } from '../../library'
import { Slider as MwcSlider } from '@material/mwc-slider'

/**
 * @attr value
 * @attr min
 * @attr max
 * @attr step
 * @attr discrete
 * @attr withTickMarks
 * @attr disabled
 * @fires input {CustomEvent}
 * @fires change {CustomEvent}
 */
@component('mo-slider')
export class Slider extends ComponentMixin(MwcSlider) {
	@property() label = ''
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-slider': Slider
	}
}