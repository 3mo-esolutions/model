import { component, property, query, ComponentMixin, Snackbar, render, html, css, renderContainer, nothing } from '../../library'
import { Dialog as MwcDialog } from '@material/mwc-dialog'

type Handler = () => unknown

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
	@property({ type: Boolean }) blocking = false
	@property({ type: Boolean }) primaryOnEnter = false
	@property({ type: Boolean }) manualClose = false
	@property() primaryButtonText = 'OK'
	@property() secondaryButtonText?: string

	protected get primaryElement() {
		return this.querySelector('[slot="primaryAction"]')
	}

	protected get secondaryElement() {
		return this.querySelector('[slot="secondaryAction"]')
	}

	@query('.mdc-dialog__surface') private readonly surfaceElement!: HTMLDivElement
	@query('footer') private readonly footerElement!: HTMLElement

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

			#flexHeader {
				flex-direction: row;
				position: absolute;
				right: 8px;
				top: 13px;
			}

			slot[name=footer] {
				flex: 1;
			}
		`
	}

	protected initialized() {
		this.createHeaderToolsSlot()
		this.createFooterSlot()
		this['contentElement'].setAttribute('part', 'content')
		this.footerElement.setAttribute('part', 'footer')
		this.primaryElement?.addEventListener('click', this.handlePrimaryButtonClick)
		this.secondaryElement?.addEventListener('click', this.handleSecondaryButtonClick)
		this.changeCloseBehavior()
	}

	private createFooterSlot() {
		const slot = document.createElement('slot')
		slot.name = 'footer'
		slot.setAttribute('part', 'footerSlot')
		this.footerElement.insertBefore(slot, this.footerElement.firstChild)
	}

	private createHeaderToolsSlot() {
		const flex = document.createElement('mo-flex')
		flex.id = 'flexHeader'
		const template = html`
			<slot name='header'></slot>
			<div id='divCloseButton'></div>
		`
		render(template, flex)
		this.surfaceElement.appendChild(flex)
	}

	private changeCloseBehavior() {
		// MoDeL has additional abilities such as cascading dialogs.
		// Therefore, we need to take control of closing dialogs and disable Material default behaviors
		// Also, some keydown related actions are handled centrally in `DialogHost.ts`
		this.addEventListener('closed', (e: CustomEvent<undefined | { action: 'close' | undefined }>) => {
			if (e.detail?.action !== 'close') {
				e.stopImmediatePropagation()
				return
			}
		})

		const scrimElement = this.shadowRoot.querySelector('.mdc-dialog__scrim') as HTMLDivElement
		scrimElement?.addEventListener('click', async (e: MouseEvent) => {
			e.stopImmediatePropagation()

			if (this.blocking)
				return

			await this.close()
		})

		// Closing all Dialogs after pressing Escape key is disabled
		this['mdcFoundation'].handleDocumentKeydown = () => void 0

		// Pressing any key, if the user is focused in the `mdcRoot`, meaning that a element e.g. a text field is focused is not propagated
		this.mdcRoot.addEventListener('keydown', e => e.stopImmediatePropagation())
	}

	@renderContainer('#divCloseButton')
	protected get closeIconButton() {
		return html`
			<mo-icon-button ?hidden=${this.blocking} icon='close' @click=${() => this.close(false)}></mo-icon-button>
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
			this.close(false)
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

	async close(success = false) {
		if (success === false) {
			await this.cancellationHandler?.()
		}
		super.close()
		this.finished.trigger(success)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog': Dialog
	}
}