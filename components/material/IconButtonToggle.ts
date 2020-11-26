import { component, property, componentize } from '../../library'
import { MaterialIcon } from '../../types'
import { IconButtonToggle as MwcIconButtonToggle } from '@material/mwc-icon-button-toggle'

/**
 * @attr on
 * @attr onIcon
 * @attr offIcon
 * @attr label
 * @attr disabled
 * @fires change
 * @slot onIcon
 * @slot offIcon
 */
@component('mdc-icon-button-toggle')
export default class IconButtonToggle extends componentize(MwcIconButtonToggle) {
	@property() onIcon!: MaterialIcon
	@eventProperty readonly changed!: IEvent

	protected initialized() {
		this.addEventListener('MDCIconButtonToggle:change', () => this.changed.trigger())
	}
}