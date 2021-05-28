import { ComponentMixin, render, component, html, css } from '..'
import { Snackbar as MwcSnackbar } from '@material/mwc-snackbar'

type Action = () => void

/**
 * @attr stacked
 * @attr leading
 * @fires MDCSnackbar:opening {CustomEvent}
 * @fires MDCSnackbar:opened {CustomEvent}
 * @fires MDCSnackbar:closing {CustomEvent<{ reason?: string }>}
 * @fires MDCSnackbar:closed {CustomEvent<{ reason?: string }>}
 * @cssprop --mdc-snackbar-action-color
 */
@component('mo-snackbar')
export class Snackbar extends ComponentMixin(MwcSnackbar) {
	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-snackbar') as Snackbar }

	static override get styles() {
		return css`
			${super.styles}

			.mdc-snackbar__surface {
				background-color: var(--mo-color-foreground);
			}

			.mdc-snackbar__label {
				color: rgba(var(--mo-color-background-base), 0.87)
			}
		`
	}

	static show(message: string, actionText = '', action: Action = () => void 0) {
		render(html`
			<mo-button slot='action' @click=${action} ?hidden=${actionText === ''}>${actionText}</mo-button>
			<mo-icon-button slot='dismiss' icon='close' fontSize='18px' foreground='var(--mo-color-background)'></mo-icon-button>
		`, this.instance)

		this.instance.timeoutMs = 5000
		this.instance.labelText = message
		this.instance.show()
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-snackbar': Snackbar
	}
}