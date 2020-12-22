import { component, property, query, ComponentMixin, Snackbar, render, html, TemplateResult, css } from '../../library'
import { Dialog as MwcDialog } from '@material/mwc-dialog'
import { IconButton } from '.'
import * as CSS from 'csstype'

type ClickHandler = (() => Promise<any>) | (() => any)

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
export default class Dialog extends ComponentMixin(MwcDialog) {
	@eventProperty readonly finished!: IEvent<boolean>

	primaryButtonClicked: ClickHandler = () => void 0
	secondaryButtonClicked?: ClickHandler

	@property()
	get header() { return this.heading }
	set header(value) { this.heading = value }

	@property({ type: Boolean })
	get isBlocking() { return this.scrimClickAction !== 'close' }
	set isBlocking(value) {
		this.scrimClickAction = value ? '' : 'close'
		this.escapeKeyAction = value ? '' : 'close'
		this.icbClose.hidden = value
	}

	@property()
	set size(value: DialogSize) {
		switch (value) {
			case 'large':
				this.style.setProperty('--mdc-dialog-max-width', 'calc(100% - 32px)')
				break
			case 'medium':
				this.style.setProperty('--mdc-dialog-max-width', 'var(--mdc-min-width)')
				break
			case 'small':
				this.style.setProperty('--mdc-dialog-max-width', '560px')
				break
		}
	}

	@property() primaryButtonText = 'OK'
	@property() secondaryButtonText?: string

	@property() actionsJustifyContent: CSS.Property.JustifyContent = 'flex-end'

	protected get primaryElement() {
		return this.querySelector('[slot="primaryAction"]')
	}

	protected get secondaryElement() {
		return this.querySelector('[slot="secondaryAction"]')
	}

	@query('.mdc-dialog__surface') private readonly divSurface!: HTMLDivElement
	@query('#actions') private readonly actionsElement!: HTMLDivElement
	@query('slot[name="primaryAction"]') private readonly primaryActionSlotElement?: HTMLSlotElement
	@query('slot[name="secondaryAction"]') private readonly secondaryActionSlotElement?: HTMLSlotElement

	protected initialized() {
		this.renderCloseIconButton()
		this.renderPrimaryButton()
		this.renderSecondaryButton()
		this.actionsElement.style.justifyContent = this.actionsJustifyContent
		this.primaryElement?.addEventListener('click', this.handlePrimaryButtonClick.bind(this))
		this.secondaryElement?.addEventListener('click', this.handleSecondaryButtonClick.bind(this))
		this.addEventListener('closed', (e: CustomEvent<{ action: 'close' | undefined }>) => {
			if (e.detail.action === 'close') {
				this.handleCancellation()
			}
		})

		// To prevent the default behavior of executing primaryAction when Enter key is pressed
		this.mdcRoot.onkeydown = e => e.stopImmediatePropagation()
	}

	static get styles() {
		return css`
			${super.styles}

			#actions {
				gap: var(--mo-thickness-xl);
			}
		`
	}

	protected render() {
		this.renderPrimaryButton()
		this.renderSecondaryButton()
		return super.render() as TemplateResult
	}

	private icbClose = new IconButton
	private renderCloseIconButton() {
		this.icbClose.icon = 'close'
		this.icbClose.onclick = () => this.handleCancellation()
		this.icbClose.position = 'absolute'
		this.icbClose.style.right = '8px'
		this.icbClose.style.top = '8px'
		this.divSurface.appendChild(this.icbClose)
	}

	private renderPrimaryButton() {
		if (!this.primaryButtonText || !this.primaryActionSlotElement)
			return

		render(html`<mo-button raised @click=${this.handlePrimaryButtonClick.bind(this)}>${this.primaryButtonText}</mo-button>`, this.primaryActionSlotElement)
	}

	private renderSecondaryButton() {
		if (!this.secondaryButtonText || !this.secondaryActionSlotElement)
			return

		render(html`<mo-button @click=${this.handleSecondaryButtonClick.bind(this)}>${this.secondaryButtonText}</mo-button>`, this.secondaryActionSlotElement)
	}

	private async handlePrimaryButtonClick() {
		try {
			await this.primaryButtonClicked()
			this.close(true)
		} catch (e) {
			Snackbar.show(e.message)
			throw e
		}
	}

	private async handleSecondaryButtonClick() {
		if (!this.secondaryButtonClicked) {
			this.handleCancellation()
			return
		}

		try {
			await this.secondaryButtonClicked()
			this.close(true)
		} catch (e) {
			Snackbar.show(e.message)
			throw e
		}
	}

	private handleCancellation() {
		this.close(false)
	}

	close(isSuccess = false) {
		super.close()
		this.finished.trigger(isSuccess)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog': Dialog
	}
}