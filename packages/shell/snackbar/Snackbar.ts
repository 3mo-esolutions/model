import { render, nothing, component, html, css, ComponentMixin } from '../../library'
import { LocalStorageEntry } from '../../utilities'
import { Snackbar as MwcSnackbar } from '@material/mwc-snackbar'
import { nonInertable } from '..'

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
@nonInertable()
export class Snackbar extends ComponentMixin(MwcSnackbar) {
	static readonly defaultTimeoutInMilliseconds = new LocalStorageEntry('MoDeL.Components.Snackbar.DefaultTimeout', 4000)

	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-snackbar') as Snackbar }

	static override get styles() {
		return [
			...super.styles,
			css`
				.mdc-snackbar__surface {
					background-color: var(--mo-color-foreground);
				}

				.mdc-snackbar__label {
					color: rgba(var(--mo-color-background-base), 0.87)
				}
			`
		]
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
					this.toasts.delete(toast)
					this.instance.close()
					resolve()
				}

				const handleAction = async () => {
					await action?.handler()
					close()
				}

				render(html`
					${!action ? nothing : html`<mo-loading-button slot='action' @click=${handleAction}>${action.text}</mo-loading-button>`}
					<mo-icon-button slot='dismiss' icon='close' fontSize='18px' foreground='var(--mo-color-background)' @click=${close}></mo-icon-button>
				`, this.instance)

				this.instance.labelText = message

				let timerId: number
				const mouseOverHandler = () => window.clearTimeout(timerId)
				const mouseOutHandler = () => attachTimer()
				const attachTimer = () => {
					this.instance.removeEventListener('mouseover', mouseOverHandler)
					this.instance.removeEventListener('mouseout', mouseOutHandler)
					timerId = window.setTimeout(() => close(), timeoutInMilliseconds)
					this.instance.addEventListener('mouseover', mouseOverHandler)
					this.instance.addEventListener('mouseout', mouseOutHandler)
				}
				attachTimer()

				this.instance.show()
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