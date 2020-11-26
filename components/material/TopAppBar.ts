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
@component('mdc-top-app-bar')
export default class TopAppBar extends componentize(MwcTopAppBar) {
	static get instance() { return MDC.applicationHost.shadowRoot.querySelector('mdc-top-app-bar') as TopAppBar }
	static set title(value: string) { this.instance.title = value }
}