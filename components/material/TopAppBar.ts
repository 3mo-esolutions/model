import { component, ComponentMixin, query } from '../../library'
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
export default class TopAppBar extends ComponentMixin(MwcTopAppBar) {
	static get instance() { return MoDeL.applicationHost.shadowRoot.querySelector('mo-top-app-bar') as TopAppBar }
	static set title(value: string) { this.instance.title = value }
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-top-app-bar': TopAppBar
	}
}