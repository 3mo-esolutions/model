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
	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-drawer') as Drawer }
	static get type() { return this.instance.type }
	static set isOpen(value: boolean) { this.instance.open = value }

	static get styles() {
		return css`
			${super.styles}

			.mdc-drawer .mdc-drawer__title {
				color: var(--mo-color-foreground);
			}

			.mdc-drawer .mdc-drawer__subtitle {
				color: var(--mo-color-foreground);
			}

			:host {
				position: relative;
			}

			:host([type=dismissible]) aside {
				background: var(--mo-color-background);
				z-index: 0;
			}

			:host([type=modal]) aside {
				top: 0;
				z-index: 9;
			}

			.mdc-drawer__content {
				margin-top: var(--mo-thickness-m);
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