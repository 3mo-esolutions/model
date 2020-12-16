import { component, property, ComponentMixin, css } from '../../library'
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
@component('mo-drawer')
export default class Drawer extends ComponentMixin(MwcDrawer) {
	static get instance() { return MoDeL.applicationHost.shadowRoot.querySelector('mo-drawer') as Drawer }
	static set isOpen(value: boolean) { this.instance.open = value }

	static get styles() {
		return css`
			${super.styles}

			.mdc-drawer__header {
				border-bottom: 1px solid var(--mo-color-gray-transparent);
			}

			.mdc-drawer {
				height: calc(100% - var(--mo-top-app-bar-height));
				margin-top: var(--mo-top-app-bar-height);
			}

			:host([type=dismissible]) .mdc-drawer {
				background: var(--mo-color-background);
			}
		`
	}

	@property() type: 'dismissible' | 'modal' = 'modal'

	constructor() {
		super()
		this.hasHeader = !!Array.from(this.children).find(child => child.slot === 'title')
		this.addEventListener('MDCTopAppBar:nav', () => this.open = !this.open)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-drawer': Drawer
	}
}