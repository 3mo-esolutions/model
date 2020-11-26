import { component, property, componentize } from '../../library'
import { Drawer as MwcDrawer } from '@material/mwc-drawer'

/**
 * @attr open
 * @attr type
 * @fires MDCDrawer:opened
 * @fires MDCDrawer:closed
 * @fires MDCDrawer:nav
 * @slot
 * @slot title
 * @slot subtitle
 * @slot header
 * @slot appContent
 */
@component('mdc-drawer')
export default class Drawer extends componentize(MwcDrawer) {
	static get instance() { return MDC.applicationHost.shadowRoot.querySelector('mdc-drawer') as Drawer }
	static set isOpen(value: boolean) { this.instance.open = value }

	@property() type: 'dismissible' | 'modal' = 'modal'

	constructor() {
		super()
		this.hasHeader = !!Array.from(this.children).find(child => child.slot === 'title')
		this.addEventListener('MDCTopAppBar:nav', () => this.open = !this.open)
	}
}