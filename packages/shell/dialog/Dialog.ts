import { component, property, query, render, html, css, renderContainer, nothing, event, PropertyValues } from '../../library'
import { Snackbar } from '..'
import { ComponentMixin } from '../..'
import { Dialog as MwcDialog } from '@material/mwc-dialog'

export type DialogSize = 'large' | 'medium' | 'small'

/**
 * @attr heading
 * @attr hideActions
 * @attr defaultAction
 * @attr actionAttribute
 * @attr initialFocusAttribute
 * @slot
 * @slot primaryAction
 * @slot secondaryAction
 * @slot header
 * @slot footer
 */
@component('mo-dialog')
export class Dialog<TResult = void> extends ComponentMixin(MwcDialog) {
	@event() readonly closed!: EventDispatcher<TResult | Error>

	@property({ reflect: true }) size: DialogSize = 'small'
	@property({ type: Boolean }) blocking = false
	@property({ type: Boolean }) primaryOnEnter = false
	@property({ type: Boolean }) manualClose = false
	@property() primaryButtonText = 'OK'
	@property() secondaryButtonText?: string

	@query('.mdc-dialog__surface') private readonly surfaceElement!: HTMLDivElement
	@query('footer') private readonly footerElement!: HTMLElement

	primaryAction!: () => TResult | PromiseLike<TResult>
	secondaryAction?: () => TResult | PromiseLike<TResult>
	cancellationAction?: () => TResult | PromiseLike<TResult>

	override initialFocusAttribute = 'data-focus'

	protected get primaryElement() {
		return this.querySelector('[slot="primaryAction"]')
	}

	protected get secondaryElement() {
		return this.querySelector('[slot="secondaryAction"]')
	}

	static override get styles() {
		return css`
			${super.styles}

			:host([size=small]) {
				--mdc-dialog-min-width: 320px;
				--mdc-dialog-max-width: 480px;
				--mdc-dialog-min-height: auto;
			}

			:host([size=medium]) {
				--mdc-dialog-max-width: 1024px;
				--mdc-dialog-min-width: calc(100% - 32px);
				--mdc-dialog-min-height: 768px;
			}

			:host([size=large]) {
				--mdc-dialog-max-width: 1680px;
				--mdc-dialog-min-width: calc(100% - 32px);
				--mdc-dialog-min-height: calc(100% - 32px);
			}

			.mdc-dialog__container {
				width: var(--mdc-dialog-max-width);
			}

			.mdc-dialog__surface {
				height: var(--mdc-dialog-min-height);
			}

			.mdc-dialog__actions {
				padding: 16px;
			}

			#actions {
				gap: var(--mo-thickness-xl);
			}

			#title {
				padding-right: 48px;
			}

			:host([size=large]) #title {
				padding-bottom: 15px;
				border-bottom: 1px solid;
			}

			:host([size=large]) #content {
				padding-top: 8px;
				padding-bottom: 8px;
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

			:host([hideFooter]) footer {
				display: none;
			}
		`
	}

	// TODO:
	//
	// MWC styles the heading using CSS '+' operator which forces us
	// not to wrap their heading with an slot element, as the heading
	// won't be a sibling of the content
	// search for '.mdc-dialog__title + .mdc-dialog__content, .mdc-dialog__header + .mdc-dialog__content'
	//
	// protected override renderHeading() {
	// 	return html`
	// 		<slot name='heading'>
	// 			${super.renderHeading()}
	// 		</slot>
	// 	`
	// }

	protected override initialized() {
		this.createHeaderSlot()
		this.createFooterSlot()
		this['contentElement'].setAttribute('part', 'content')
		this.footerElement.setAttribute('part', 'footer')
		this.primaryElement?.addEventListener('click', this.handlePrimaryButtonClick)
		this.secondaryElement?.addEventListener('click', this.handleSecondaryButtonClick)
		this.changeCloseBehavior()
	}

	protected override updated(props: PropertyValues) {
		super.updated(props)
		this.decideFooterVisibility()
	}

	private decideFooterVisibility() {
		const hideFooter = !this.primaryButton
			&& !this.secondaryButton
			&& this.shadowRoot.querySelector<HTMLSlotElement>('slot[name=footer]')?.assignedElements().length === 0
		this.switchAttribute('hideFooter', hideFooter)
	}

	private createHeaderSlot() {
		const flex = document.createElement('mo-flex')
		flex.id = 'flexHeader'
		const template = html`
			<slot name='header'></slot>
			<div id='divCloseButton'></div>
		`
		render(template, flex)
		this.surfaceElement.appendChild(flex)
	}

	private createFooterSlot() {
		const slot = document.createElement('slot')
		slot.name = 'footer'
		slot.setAttribute('part', 'footerSlot')
		this.footerElement.insertBefore(slot, this.footerElement.firstChild)
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

		const scrimElement = this.shadowRoot.querySelector<HTMLElement>('.mdc-dialog__scrim')
		scrimElement?.addEventListener('click', async (e: MouseEvent) => {
			e.stopImmediatePropagation()

			if (this.blocking) {
				return
			}

			await this.close()
		})

		// Closing all Dialogs after pressing Escape key is disabled
		this.mdcFoundation.handleDocumentKeydown = () => void 0

		// Disable MDC clicking on the primary button on Enter to prevent double clicks as DialogHost is now responsible for this
		this.mdcFoundation['adapter'].clickDefaultButton = () => void 0
	}

	@renderContainer('#divCloseButton')
	protected get closeIconButton() {
		return html`
			<mo-icon-button ?hidden=${this.blocking} icon='close' @click=${() => this.cancel()}></mo-icon-button>
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

	override get primaryButton() {
		return this.shadowRoot.querySelector<HTMLElement>('slot[name=primaryAction] > mo-button') ?? this.querySelector<HTMLElement>('mo-button[slot=primaryAction]')
	}

	@renderContainer('slot[name="secondaryAction"]')
	protected get secondaryButtonTemplate() {
		return !this.secondaryButtonText ? nothing : html`
			<mo-button @click=${this.handleSecondaryButtonClick}>
				${this.secondaryButtonText}
			</mo-button>
		`
	}

	get secondaryButton() {
		return this.shadowRoot.querySelector<HTMLElement>('slot[name=secondaryAction] > mo-button') ?? this.querySelector<HTMLElement>('mo-button[slot=secondaryAction]')
	}

	private readonly cancel = () => this.close(new Error('Dialog cancelled'))

	private readonly handlePrimaryButtonClick = () => this.handleAction(this.primaryAction)

	private readonly handleSecondaryButtonClick = () => this.secondaryAction ? this.handleAction(this.secondaryAction) : this.cancel()

	private readonly handleAction = async (resultAction: () => TResult | PromiseLike<TResult>) => {
		if (this.manualClose === true) {
			return
		}

		// Actions do NOT close the dialog in the case of an error.
		try {
			const result = await resultAction()
			this.close(result)
		} catch (e: any) {
			Snackbar.show(e.message)
			throw e
		}
	}

	override async close(result?: TResult | Error) {
		if (result instanceof Error) {
			await this.cancellationAction?.()
		}

		super.close()

		if (result !== undefined) {
			this.closed.dispatch(result)
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog': Dialog
	}
}