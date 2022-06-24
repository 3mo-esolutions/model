import { Component, state, css, html, TemplateHelper, component, ifDefined } from '../../library'
import { Snackbar, SnackbarType } from './Snackbar'

type SnackbarActionClickHandler = () => void | PromiseLike<void>
type SnackbarAction = {
	readonly title: string
	readonly handleClick: SnackbarActionClickHandler
}

type SnackbarOptions = {
	readonly type?: SnackbarType
	readonly message: string
	readonly actions?: Array<SnackbarAction>
}

@component('mo-snackbar-host')
export class SnackbarHost extends Component {
	static readonly shownSnackbars = new Set<SnackbarOptions>()

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

	async show(snackbarOptions: SnackbarOptions) {
		const close = async () => {
			snackbar.close()
			await Promise.all([this.updateComplete, snackbar.updateComplete])
			this.snackbars.delete(snackbar)
			this.requestUpdate()
		}

		const handleAction = async (action: SnackbarActionClickHandler) => {
			await action()
			await close()
		}

		const snackbarTemplate = html`
			<mo-snackbar labelText=${snackbarOptions.message}
				?stacked=${(snackbarOptions.actions?.length ?? 0) > 1}
				type=${ifDefined(snackbarOptions.type)}
				@MDCSnackbar:closed=${close}
			>
				${snackbarOptions.actions?.map(action => html`
					<mo-loading-button slot='action' @click=${() => handleAction(action.handleClick)}>${action.title}</mo-loading-button>
				`)}
			</mo-snackbar>
		`

		const snackbar = TemplateHelper.extractBySelector(snackbarTemplate, 'mo-snackbar')
		SnackbarHost.shownSnackbars.add(snackbarOptions)
		await this.showSnackbar(snackbar)
	}

	private async showSnackbar(snackbar: Snackbar) {
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