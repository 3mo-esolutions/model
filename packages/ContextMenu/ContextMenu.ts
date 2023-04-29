import { component, PropertyValues } from '@a11d/lit'
import { DeprecatedMenu } from '../DeprecatedMenu'
import { MenuSurface as MwcMenuSurface } from '@material/mwc-menu/mwc-menu-surface'

@component('mo-context-menu')
export class ContextMenu extends DeprecatedMenu {
	protected override async firstUpdated() {
		await super.firstUpdated()
		this.overrideRootOverflow()
	}

	protected override updated(props: PropertyValues) {
		super.updated(props)
		this.overrideRootOverflow()
	}

	private overrideRootOverflow() {
		const surface = this.mdcRoot as MwcMenuSurface | null
		const div = surface?.mdcRoot as HTMLDivElement | null
		if (div) {
			div.style.overflow = 'unset'
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu': ContextMenu
	}
}