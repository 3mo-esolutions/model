import { ComponentMixin, render, nothing, component, html, css } from '..'
import { Snackbar as MwcSnackbar } from '@material/mwc-snackbar'
import { LocalStorageEntry } from '../../helpers'

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
	static readonly defaultTimeoutInMilliseconds = new LocalStorageEntry('MoDeL.Components.Snackbar.DefaultTimeout', 4000)

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

	private static readonly toasts = new Set<Promise<void>>()

	static show(
		message: string,
		action?: {
			text: string
			handler: () => void | PromiseLike<void>
		},
		timeoutInMilliseconds = Snackbar.defaultTimeoutInMilliseconds.value,
	) {
		const toast = new Promise<void>(resolve => {
			Promise.all(this.toasts).then(() => {
				const close = () => {
					this.instance.close()
					resolve()
					this.toasts.delete(toast)
				}

				const processAndClose = async () => {
					await action?.handler()
					close()
				}

				render(html`
					${!action ? nothing : html`<mo-button slot='action' @click=${processAndClose}>${action.text}</mo-button>`}
					<mo-icon-button slot='dismiss' icon='close' fontSize='18px' foreground='var(--mo-color-background)' @click=${close}></mo-icon-button>
				`, this.instance)

				this.instance.labelText = message
				this.instance.show()
				setTimeout(() => close(), timeoutInMilliseconds)
			})
		})
		this.toasts.add(toast)
		return toast
	}

	override timeoutMs = -1
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-snackbar': Snackbar
	}
}