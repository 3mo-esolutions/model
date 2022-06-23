import { Component, state, css, html, TemplateHelper, nothing, component } from '../../library'
import { Snackbar, SnackbarType } from './Snackbar'

@component('mo-snackbar-host')
export class SnackbarHost extends Component {
	@state() private readonly snackbars = new Set<Snackbar>()

	static override get styles() {
		return css`
			:host {
				position: fixed;
				z-index: 1;
				inset-block-end: 0;
				inset-inline: 0;
				max-height: max(50vh, 50%);

				display: grid;
				justify-items: center;
				justify-content: center;
				gap: 0.5vh;

				overflow: hidden;

				/* optimizations */
				pointer-events: none;
			}

			mo-snackbar {
				position: relative;
				--mo-snackbar-position: relative;
			}
		`
	}

	protected override get template() {
		return html`${this.snackbars}`
	}

	async show(type: SnackbarType, message: string, action?: { text: string, handler: () => void | PromiseLike<void> }) {
		const close = async () => {
			snackbar.close()
			await Promise.all([this.updateComplete, snackbar.updateComplete])
			this.snackbars.delete(snackbar)
			this.requestUpdate()
		}

		const handleAction = async () => {
			await action?.handler()
			await close()
		}

		const snackbarTemplate = html`
			<mo-snackbar labelText=${message} type=${type} @MDCSnackbar:closed=${() => close()}>
				${!action ? nothing : html`<mo-loading-button slot='action' @click=${handleAction}>${action.text}</mo-loading-button>`}
			</mo-snackbar>
		`

		const snackbar = TemplateHelper.extractBySelector(snackbarTemplate, 'mo-snackbar')

		this.snackbars.add(snackbar)
		const promise = snackbar.show()

		this.requestUpdate()
		await this.updateComplete

		snackbar.scrollIntoView({ behavior: 'smooth' })

		await promise
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-snackbar-host': SnackbarHost
	}
}