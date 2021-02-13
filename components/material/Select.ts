import { component, property, ComponentMixin } from '../../library'
import { Select as MwcSelect } from '@material/mwc-select'
import { MaterialIcon } from '../../types'

/**
 * @attr value
 * @attr label
 * @attr naturalMenuWidth
 * @attr disabled
 * @attr outlined
 * @attr helper
 * @attr required
 * @attr validationMessage
 * @attr selected
 * @attr items
 * @attr index
 * @attr validity
 * @attr validityTransform
 * @attr validateOnInitialRender
 * @fires opened
 * @fires closed
 * @fires action
 * @fires selected
 */
@component('mo-select')
export class Select extends ComponentMixin(MwcSelect) {
	@property() icon!: MaterialIcon
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-select': Select
	}
}