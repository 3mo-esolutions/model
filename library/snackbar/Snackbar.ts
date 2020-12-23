import { ComponentMixin, render, component, html } from '..'
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
@component('mo-snackbar')
export default class Snackbar extends ComponentMixin(MwcSnackbar) {
	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-snackbar') as Snackbar }

	static get show() { return this.instance.createAndShow.bind(this.instance) }

	private createAndShow(message: string, actionText = '', action: () => void = () => void 0) {
		const slots = html`
			<mo-button slot='action' @click=${() => action()} ?hidden=${actionText === ''}>${actionText}</mo-button>
			<mo-icon-button slot='dismiss' icon='close' size='18px' foreground='white'></mo-icon-button>
		`
		render(slots, this)

		this.timeoutMs = 5000
		this.labelText = message
		this.show()
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-snackbar': Snackbar
	}
}