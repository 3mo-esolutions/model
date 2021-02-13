import { component, ComponentMixin } from '../../library'
import { Menu as MwcMenu } from '@material/mwc-menu'

/**
 * @attr open
 * @attr anchor
 * @attr corner
 * @attr menuCorner
 * @attr quick
 * @attr absolute
 * @attr fixed
 * @attr x
 * @attr y
 * @attr forceGroupSelection
 * @attr defaultFocus
 * @attr innerRole
 * @attr multi
 * @attr activatable
 * @fires opened
 * @fires closed
 * @fires action
 * @fires selected
 * @cssprop --mdc-menu-item-height
 * @cssprop --mdc-menu-min-width
 * @cssprop --mdc-menu-max-width
 * @cssprop --mdc-menu-max-height
 * @cssprop --mdc-menu-z-index
 * @cssprop --mdc-menu-z-index
 */
@component('mo-menu')
export class Menu extends ComponentMixin(MwcMenu) { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-menu': Menu
	}
}