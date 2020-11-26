import { componentize, render, component, html } from '..'
import { Snackbar as MwcSnackbar } from '@material/mwc-snackbar'

/**
 * @attr stacked
 * @attr leading
 * @fires MDCSnackbar:opening
 * @fires MDCSnackbar:opened
 * @fires MDCSnackbar:closing
 * @fires MDCSnackbar:closed
 * @cssprop --mdc-snackbar-action-color
 */
@component('mdc-snackbar')
export default class Snackbar extends componentize(MwcSnackbar) {
	static get instance() { return MDC.applicationHost.shadowRoot.querySelector('mdc-snackbar') as Snackbar }

	static get show() { return this.instance.createAndShow.bind(this.instance) }

	private createAndShow(message: string, actionText = '', action: () => void = () => void 0) {
		const slots = html`
			<mdc-button slot='action' @click=${() => action()} ?hidden=${actionText === ''}>${actionText}</mdc-button>
			<mdc-icon-button slot='dismiss' icon='close' size='18px' foreground='white'></mdc-icon-button>
		`
		render(slots, this)

		this.timeoutMs = 5000
		this.labelText = message
		this.show()
	}
}