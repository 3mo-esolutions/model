import { component, ComponentMixin, property } from '../../library'
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
export class Menu extends ComponentMixin(MwcMenu) {
	@property({ type: Boolean, reflect: true, observer: manualCloseChanged }) manualClose = false
}

function manualCloseChanged(this: Menu) {
	if (this.manualClose === false)
		return

	const surfaceElement = this.shadowRoot.querySelector('mwc-menu-surface')
	// Here, the internals of menu and menu surface are manipulated to prevent automatic
	// closings of the menu. Material team is aware of this problem and the issue is filed in this link:
	// https://github.com/material-components/material-components-web-components/issues/1353
	surfaceElement?.['deregisterBodyClick']()
	this['mdcFoundation']['adapter'].closeSurface = () => void 0
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-menu': Menu
	}
}