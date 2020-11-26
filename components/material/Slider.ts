import { component, property, componentize, InputElement } from '../../library'
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
@component('mdc-slider')
export default class Slider extends componentize(MwcSlider) implements InputElement<number> {
	@property() label = ''
	// @ts-ignore overriding the type
	value: number
}