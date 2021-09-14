import { component, ComponentMixin, css } from '../../library'
import { TopAppBar as MwcTopAppBar } from '@material/mwc-top-app-bar'

/**
 * @attr centerTitle
 * @attr dense
 * @attr prominent
 * @attr scrollTarget
 * @fires MDCTopAppBar:nav {CustomEvent}
 * @slot
 * @slot title
 * @slot navigationIcon
 * @slot actionItems
 */
@component('mo-top-app-bar')
export class TopAppBar extends ComponentMixin(MwcTopAppBar) {
	static override get styles() {
		return css`
			${super.styles}

			:host {
				display: flex;
				width: 100%;
			}

			header {
				background: var(--mo-accent-gradient);
			}

			header+div {
				width: 100%;
			}

			.mdc-top-app-bar--dense.mdc-top-app-bar--prominent .mdc-top-app-bar__title {
				padding-bottom: 0px !important;
			}

			#actions {
				align-items: flex-start;
			}
		`
	}
	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-top-app-bar') as TopAppBar }
	static set title(value: string) { this.instance.title = value }

	protected override initialized() {
		this.shadowRoot.querySelector('#navigation')?.setAttribute('part', 'navigation')
		this.shadowRoot.querySelector('#navigation+section')?.setAttribute('part', 'header')
		this.shadowRoot.querySelector('#actions')?.setAttribute('part', 'actions')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-top-app-bar': TopAppBar
	}
}