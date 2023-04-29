import { component, css, PropertyValues } from '@a11d/lit'
import { Drawer as MwcDrawer } from '@material/mwc-drawer'
import { ClientInfoHelper } from './utilities'

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
export class Drawer extends MwcDrawer {
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
					margin-top: 6px;
					scrollbar-color: rgba(128, 128, 128, 0.75) transparent;
					scrollbar-width: thin;
				}

				.mdc-drawer__content::-webkit-scrollbar {
					width: 5px;
					height: 5px;
				}

				.mdc-drawer__content::-webkit-scrollbar-thumb {
					background: rgba(128, 128, 128, 0.75);
				}
			`
		]
	}

	override readonly type: DrawerType = 'modal'

	constructor() {
		super()
		this.hasHeader = !!Array.from(this.children).find(child => child.slot === 'title')
		this.addEventListener('MDCTopAppBar:nav', () => this.open = !this.open)
	}

	protected override updated(changedProperties: PropertyValues<this>) {
		super.updated(changedProperties)
		if (changedProperties.has('open') && this.open === false && ClientInfoHelper.browser === 'Safari') {
			this.recoverFromInertBugInSafari()
		}
	}

	private async recoverFromInertBugInSafari() {
		await Promise.sleep(0)
		this.appContent.inert = false
		// @ts-expect-error $blockingElements exists but is not in the type definition
		document.$blockingElements.pop()
		const aside = this.renderRoot.querySelector('aside')
		aside?.classList.remove('mdc-drawer--open')
		aside?.classList.remove('mdc-drawer--closing')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-drawer': Drawer
	}
}