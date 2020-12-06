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
export default class Slider extends ComponentMixin(MwcSlider) {
	@property() label = ''
	// @ts-ignore overriding the type
	value: number
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-slider': Slider
	}
}