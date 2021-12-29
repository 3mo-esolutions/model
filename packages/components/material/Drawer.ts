import { component, property, css, ComponentMixin } from '../../library'
import { LocalStorageEntry } from '../../utilities'
import { Drawer as MwcDrawer } from '@material/mwc-drawer'

// This is defined by MWC and cannot be renamed
type DrawerType =
	| 'dismissible' /* docked */
	| 'modal'

/**
 * @attr open
 * @attr type
 * @attr hasHeader
 * @fires MDCDrawer:opened {CustomEvent}
 * @fires MDCDrawer:closed {CustomEvent}
 * @fires MDCDrawer:nav {CustomEvent}
 * @slot
 * @slot title
 * @slot subtitle
 * @slot header
 * @slot appContent
 */
@component('mo-drawer')
export class Drawer extends ComponentMixin(MwcDrawer) {
	static readonly isDocked = new LocalStorageEntry('MoDeL.Components.Drawer.IsDocked', false)

	static override get styles() {
		return [
			...super.styles,
			css`
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

				:host([type=dismissible]) .mdc-drawer__header {
					display: none;
				}

				.mdc-drawer__content {
					margin-top: var(--mo-thickness-m);
					scrollbar-color: var(--mo-scrollbar-foreground-color) var(--mo-scrollbar-background-color);
					scrollbar-width: thin;
				}

				.mdc-drawer__content::-webkit-scrollbar {
					width: 5px;
					height: 5px;
				}

				.mdc-drawer__content::-webkit-scrollbar-thumb {
					background: var(--mo-scrollbar-foreground-color);
				}
			`
		]
	}

	@property({ reflect: true }) override type: DrawerType = 'modal'

	constructor() {
		super()
		this.hasHeader = !!Array.from(this.children).find(child => child.slot === 'title')
		this.addEventListener('MDCTopAppBar:nav', () => this.open = !this.open)
		this.setupType()
	}

	private setupType() {
		const changeHandler = () => this.type = Drawer.isDocked.value && MoDeL.application.view === 'desktop' ? 'dismissible' : 'modal'
		Drawer.isDocked.changed.subscribe(() => changeHandler())
		MoDeL.application.viewChange.subscribe(() => changeHandler())
		changeHandler()
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-drawer': Drawer
	}
}