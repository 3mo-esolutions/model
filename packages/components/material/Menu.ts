import { component, property, ComponentMixin } from '../../library'
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
 * @slot
 * @fires opened {CustomEvent}
 * @fires closing {CustomEvent}
 * @fires closed {CustomEvent}
 * @fires action {CustomEvent<{ index: number }>}
 * @fires selected {CustomEvent<SelectedDetail>}
 * @cssprop --mdc-menu-item-height
 * @cssprop --mdc-menu-min-width
 * @cssprop --mdc-menu-max-width
 * @cssprop --mdc-menu-max-height
 * @cssprop --mdc-menu-z-index
 */
@component('mo-menu')
export class Menu extends ComponentMixin(MwcMenu) {
	@property({ type: Boolean, reflect: true }) manualClose = false

	protected override initialized() {
		this.overrideClosingLogic()
	}

	override get listElement() {
		try {
			return super.listElement
		} catch (error) {
			return null
		}
	}

	private overrideClosingLogic() {
		// Here, the internals of menu and menu surface are manipulated to prevent automatic
		// closings of the menu. Material team is aware of this problem and the issue is filed in this link:
		// https://github.com/material-components/material-components-web-components/issues/1353
		const surfaceElement = this.shadowRoot.querySelector('mwc-menu-surface')
		surfaceElement?.['deregisterBodyClick']()
		const fn = this['mdcFoundation']['adapter'].closeSurface
		const menu = this
		this['mdcFoundation']['adapter'].closeSurface = function (this) {
			if (menu.manualClose === false) {
				fn.call(this)
			}
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-menu': Menu
	}
}