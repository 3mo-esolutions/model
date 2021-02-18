import { component, property, query, ComponentMixin, Snackbar, render, html, nothing, css, renderContainer } from '../../library'
import { Dialog as MwcDialog } from '@material/mwc-dialog'

type Handler = (() => Promise<any>) | (() => any)

type DialogSize = 'large' | 'medium' | 'small'

/**
 * @attr hideActions
 * @attr defaultAction
 * @attr actionAttribute
 * @attr initialFocusAttribute
 * @cssprop --mdc-dialog-scrim-color
 * @cssprop --mdc-dialog-heading-ink-color
 * @cssprop --mdc-dialog-content-ink-color
 * @cssprop --mdc-dialog-scroll-divider-color
 * @cssprop --mdc-dialog-min-width
 * @cssprop --mdc-dialog-max-width
 * @cssprop --mdc-dialog-max-height
 * @cssprop --mdc-dialog-box-shadow
 */
@component('mo-dialog')
export class Dialog extends ComponentMixin(MwcDialog) {
	@eventProperty() readonly finished!: IEvent<boolean>

	primaryButtonClicked?: Handler
	secondaryButtonClicked?: Handler
	cancellationHandler?: Handler

	@property()
	get header() { return this.heading }
	set header(value) { this.heading = value }
	@property({ reflect: true }) size: DialogSize = 'small'
	@property({ type: Boolean, observer: blockingChanged }) blocking = false
	@property() primaryButtonText = 'OK'
	@property() secondaryButtonText?: string
	@property({ type: Boolean }) primaryOnEnter = false
	@property({ type: Boolean }) manualClose = false

	protected get primaryElement() {
		return this.querySelector('[slot="primaryAction"]')
	}

	protected get secondaryElement() {
		return this.querySelector('[slot="secondaryAction"]')
	}

	@query('.mdc-dialog__surface') private readonly divSurface!: HTMLDivElement
	@query('.mdc-dialog__content') private readonly divContent!: HTMLDivElement
	@query('#actions') private readonly divActions!: HTMLDivElement

	protected initialized() {
		this.createHeaderTools()
		this.divContent.setAttribute('part', 'content')
		this.divActions.setAttribute('part', 'actions')
		this.primaryElement?.addEventListener('click', this.handlePrimaryButtonClick)
		this.secondaryElement?.addEventListener('click', this.handleSecondaryButtonClick)
		this.addEventListener('closed', (e: CustomEvent<{ action: 'close' | undefined }>) => {
			if (e.detail?.action !== 'close') {
				e.stopImmediatePropagation()
				return
			}

			this.handleCancellation()
		})

		this.mdcRoot.onkeydown = e => {
			if (this.primaryOnEnter === false) {
				e.stopImmediatePropagation()
			}
		}
	}

	static get styles() {
		return css`
			${super.styles}

			:host([size=small]) {
				--mdc-dialog-max-width: 480px;
			}

			:host([size=medium]) {
				--mdc-dialog-max-width: 1024px;
				--mdc-dialog-min-width: calc(100% - 32px);
				--mdc-dialog-min-height: 768px;
			}

			:host([size=large]) {
				--mdc-dialog-max-width: calc(100% - 32px);
				--mdc-dialog-min-width: calc(100% - 32px);
				--mdc-dialog-min-height: calc(100% - 32px);
			}

			.mdc-dialog__container {
				width: var(--mdc-dialog-max-width);
			}

			.mdc-dialog__surface {
				height: var(--mdc-dialog-min-height);
			}

			#actions {
				gap: var(--mo-thickness-xl);
			}

			#title {
				padding-right: 48px;
			}

			#content {
				scrollbar-color: var(--mo-scrollbar-foreground-color) var(--mo-scrollbar-background-color);
				scrollbar-width: thin;
			}

			#content::-webkit-scrollbar {
				width: 5px;
				height: 5px;
			}

			#content::-webkit-scrollbar-thumb {
				background: var(--mo-scrollbar-foreground-color);
			}

			:host([size=large]) #actions, :host([size=large]) #title {
				border-color: var(--mdc-dialog-scroll-divider-color);
			}
		`
	}

	private createHeaderTools() {
		const flex = document.createElement('mo-flex')
		flex.direction = 'horizontal'
		flex.style.position = 'absolute'
		flex.style.right = '8px'
		flex.style.top = '13px'
		const template = html`
			<slot name='headerOptions'></slot>
			<div id='divCloseButton'></div>
		`
		render(template, flex)
		this.divSurface.appendChild(flex)
	}


	@renderContainer('#divCloseButton')
	protected get closeIconButton() {
		return html`
			<mo-icon-button ?hidden=${this.blocking} icon='close' @click=${this.handleCancellation}></mo-icon-button>
		`
	}

	@renderContainer('slot[name="primaryAction"]')
	protected get primaryButtonTemplate() {
		return !this.primaryButtonText ? nothing : html`
			<mo-button raised @click=${this.handlePrimaryButtonClick}>
				${this.primaryButtonText}
			</mo-button>
		`
	}

	@renderContainer('slot[name="secondaryAction"]')
	protected get secondaryButtonTemplate() {
		return !this.secondaryButtonText ? nothing : html`
			<mo-button @click=${this.handleSecondaryButtonClick}>
				${this.secondaryButtonText}
			</mo-button>
		`
	}

	private handlePrimaryButtonClick = async () => {
		try {
			await this.primaryButtonClicked?.()
			if (this.manualClose !== true) {
				this.close(true)
			}
		} catch (e) {
			Snackbar.show(e.message)
			throw e
		}
	}

	private handleSecondaryButtonClick = async () => {
		if (!this.secondaryButtonClicked) {
			this.handleCancellation()
			return
		}

		try {
			await this.secondaryButtonClicked()
			if (this.manualClose !== true) {
				this.close(true)
			}
		} catch (e) {
			Snackbar.show(e.message)
			throw e
		}
	}

	private handleCancellation = async () => {
		await this.cancellationHandler?.()
		this.close(false)
	}

	close(isSuccess = false) {
		super.close()
		this.finished.trigger(isSuccess)
	}
}

function blockingChanged(this: Dialog) {
	this.scrimClickAction = this.blocking ? '' : 'close'
	this.escapeKeyAction = this.blocking ? '' : 'close'
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog': Dialog
	}
}