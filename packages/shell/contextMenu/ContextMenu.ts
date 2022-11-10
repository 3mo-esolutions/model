import { component, PropertyValues } from '@a11d/lit'
import { Menu } from '../../components/material'
import { MenuSurface as MwcMenuSurface } from '@material/mwc-menu/mwc-menu-surface'

@component('mo-context-menu')
export class ContextMenu extends Menu {
	protected override initialized() {
		super.initialized()
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