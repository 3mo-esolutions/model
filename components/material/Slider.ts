import { component, property, ComponentMixin } from '../../library'
import { Slider as MwcSlider } from '@material/mwc-slider'

/**
 * @attr value
 * @attr min
 * @attr max
 * @attr step
 * @attr pin
 * @attr markers
 * @fires input
 * @fires change
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