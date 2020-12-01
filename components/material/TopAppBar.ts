import { component, componentize } from '../../library'
import { TopAppBar as MwcTopAppBar } from '@material/mwc-top-app-bar'

/**
 * @attr centerTitle
 * @attr dense
 * @attr prominent
 * @attr scrollTarget
 * @fires MDCTopAppBar:nav
 * @slot
 * @slot title
 * @slot navigationIcon
 * @slot actionItems
 */
@component('mo-top-app-bar')
export default class TopAppBar extends componentize(MwcTopAppBar) {
	static get instance() { return MoDeL.applicationHost.shadowRoot.querySelector('mo-top-app-bar') as TopAppBar }
	static set title(value: string) { this.instance.title = value }

	// NOTE: the height of the material top app bar is hardcoded to 64px
	// Here the internals are accessed to manipulate the height
	@query('.mdc-top-app-bar__row') private divRow!: HTMLDivElement

	protected initialized() {
		super.initialized()
		this.divRow.style.height = 'var(--mo-top-app-bar-height)'
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-top-app-bar': TopAppBar
	}
}