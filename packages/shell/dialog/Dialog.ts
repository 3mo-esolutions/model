import { component, property, query, render, html, css, renderContainer, nothing, event, PropertyValues } from '../../library'
import { Snackbar } from '..'
import { ComponentMixin } from '../..'
import { Dialog as MwcDialog } from '@material/mwc-dialog'

export type DialogSize = 'large' | 'medium' | 'small'

export type DialogActionKey = '' | 'primary' | 'secondary' | 'cancellation'

type DialogAction<TResult = void> = TResult | PromiseLike<TResult>

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
	@event() readonly requestPopup!: EventDispatcher

	@property({ reflect: true }) size: DialogSize = 'small'
	@property({ type: Boolean }) blocking = false
	@property({ type: Boolean }) primaryOnEnter = false
	@property({ type: Boolean }) manualClose = false
	@property() primaryButtonText = 'OK'
	@property() secondaryButtonText?: string
	@property() override initialFocusAttribute = 'data-focus'
	@property() override scrimClickAction: DialogActionKey = ''
	@property() override escapeKeyAction: DialogActionKey = 'cancellation'
	@property({ type: Boolean }) popupContinuation = false
	@property({ type: Boolean, reflect: true }) boundToWindow = false

	@query('.mdc-dialog__surface') private readonly surfaceElement!: HTMLDivElement
	@query('footer') private readonly footerElement!: HTMLElement

	primaryAction!: () => DialogAction<TResult>
	secondaryAction?: () => DialogAction<TResult>
	cancellationAction?: () => DialogAction<TResult>

	get isActiveDialog(): boolean {
		return MoDeL.application.dialogHost.focusedDialogComponent?.['dialog'] === this
	}

	override get primaryButton() {
		return this.querySelector<HTMLElement>('[slot=primaryAction]') ?? this.shadowRoot.querySelector<HTMLElement>('slot[name=primaryAction] > *')
	}

	get secondaryButton() {
		return this.querySelector<HTMLElement>('[slot=secondaryAction]') ?? this.shadowRoot.querySelector<HTMLElement>('slot[name=secondaryAction] > *')
	}

	static override get styles() {
		return [
			...super.styles,
			css`
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

				:host([boundToWindow][size=large]) {
					--mdc-dialog-max-width: 100%;
					--mdc-dialog-min-width: 100%;
					--mdc-dialog-min-height: 100%;
					--mdc-dialog-max-height: 100%;
				}

				:host([boundToWindow]) {
					--mdc-dialog-scrim-color: var(--mo-color-background);
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
		]
	}

	// TODO: Dynamic heading slot
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

	override connectedCallback() {
		super.connectedCallback()
		window.addEventListener('beforeunload', this.handleBeforeUnload)
		document.addEventListener('keydown', this.handleKeyDown)
	}

	override disconnectedCallback() {
		super.disconnectedCallback()
		window.removeEventListener('beforeunload', this.handleBeforeUnload)
		document.removeEventListener('keydown', this.handleKeyDown)
	}

	private readonly handleKeyDown = async (e: KeyboardEvent) => {
		if (this.isActiveDialog) {
			if (this.primaryOnEnter === true && e.key === KeyboardKey.Enter) {
				(document.deepActiveElement as HTMLElement).blur()
				await this.handleAction('primary')
			}
		}
	}

	private readonly handleBeforeUnload = () => {
		if (this.boundToWindow) {
			this.handleAction('cancellation')
		}
	}

	protected override initialized() {
		this.createHeaderSlot()
		this.createFooterSlot()
		this['contentElement'].setAttribute('part', 'content')
		this.footerElement.setAttribute('part', 'footer')

		this.changeCloseBehavior()

		const handlePrimaryButtonClick = () => this.handleAction('primary')
		this.primaryButton?.addEventListener('click', handlePrimaryButtonClick)
		this.primarySlot.addEventListener('slotchange', () => this.primaryButton?.addEventListener('click', handlePrimaryButtonClick))

		const handleSecondaryButtonClick = () => this.handleAction('secondary')
		this.secondaryButton?.addEventListener('click', handleSecondaryButtonClick)
		this.secondarySlot.addEventListener('slotchange', () => this.secondaryButton?.addEventListener('click', handleSecondaryButtonClick))
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
		flex.alignItems = 'center'
		flex.id = 'flexHeader'
		const template = html`
			<slot name='header'></slot>
			<div id='divHeaderOptions'></div>
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
		const closeBase = this.mdcFoundation.close
		this.mdcFoundation.close = (action?: DialogActionKey) => {
			if (this.isActiveDialog) {
				closeBase.call(this.mdcFoundation, action)
				this.handleAction(action)
			}
		}
	}

	protected override setEventListeners() {
		this.boundHandleKeydown = null
		super.setEventListeners()
	}

	@renderContainer('#divHeaderOptions')
	protected get headerOptionsTemplate() {
		return html`
			${this.boundToWindow || !this.popupContinuation ? nothing : html`<mo-icon-button icon='launch' @click=${() => this.requestPopup.dispatch()}></mo-icon-button>`}
			${this.boundToWindow || this.blocking ? nothing : html`<mo-icon-button icon='close' @click=${() => this.handleAction('cancellation')}></mo-icon-button>`}
		`
	}

	@renderContainer('slot[name="primaryAction"]')
	protected get primaryButtonTemplate() {
		return !this.primaryButtonText ? nothing : html`
			<mo-button type='raised' @click=${() => this.handleAction('primary')}>
				${this.primaryButtonText}
			</mo-button>
		`
	}

	@renderContainer('slot[name="secondaryAction"]')
	protected get secondaryButtonTemplate() {
		return !this.secondaryButtonText ? nothing : html`
			<mo-button @click=${() => this.handleAction('secondary')}>
				${this.secondaryButtonText}
			</mo-button>
		`
	}

	private handleAction(action?: DialogActionKey) {
		const handle = async (action: () => DialogAction<TResult>) => {
			try {
				const result = await action()
				if (this.manualClose === false) {
					this.close(result)
				}
			} catch (e: any) {
				Snackbar.show(e.message)
				throw e
			}
		}

		const cancellationAction = async () => this.close(this.cancellationAction ? await this.cancellationAction() : new Error('Dialog cancelled'))

		switch (action) {
			case 'primary':
				return handle(this.primaryAction)
			case 'secondary':
				return this.secondaryAction ? handle(this.secondaryAction) : cancellationAction()
			case 'cancellation':
				return cancellationAction()
			default:
				return Promise.resolve()
		}
	}

	// @ts-expect-error The base close method is a utility method and won't be called
	override close(result: TResult | Error) {
		super.close()
		this.closed.dispatch(result)
		if (this.boundToWindow) {
			window.close()
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog': Dialog
	}
}