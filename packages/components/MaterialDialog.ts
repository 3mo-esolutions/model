import { component, property, query, render, html, css, renderContainer, nothing, event, PropertyValues, ComponentMixin, eventListener, state } from '../../library'
import { DialogActionKey, DialogComponent } from '../shell'
import { Dialog as MwcDialog } from '@material/mwc-dialog'
import type { IconButton } from './material'

export const enum MaterialDialogSize {
	Large = 'large',
	Medium = 'medium',
	Small = 'small',
}

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
@DialogComponent.dialogElement()
export class MaterialDialog extends ComponentMixin(MwcDialog) {
	static readonly executingActionAdaptersByComponent = new Map<Constructor<HTMLElement>, (actionElement: HTMLElement, isExecuting: boolean) => void>()

	@event({ bubbles: true, cancelable: true, composed: true }) readonly dialogHeadingChange!: EventDispatcher<string>
	@event() readonly requestPopup!: EventDispatcher

	@property({ reflect: true }) size = MaterialDialogSize.Small
	@property({ type: Boolean }) blocking = false
	@property({ type: Boolean }) primaryOnEnter = false
	@property({ type: Boolean }) manualClose = false
	@property() primaryButtonText = 'OK'
	@property() secondaryButtonText?: string
	@property() override initialFocusAttribute = 'data-focus'
	@property() override scrimClickAction: DialogActionKey | '' = ''
	@property() override escapeKeyAction = DialogActionKey.Cancellation
	@property({ type: Boolean }) poppable = false
	@property({ type: Boolean, reflect: true }) boundToWindow = false

	@state({
		updated(this: MaterialDialog) {
			if (this.primaryActionElement) {
				const PrimaryButtonConstructor = this.primaryActionElement.constructor as Constructor<HTMLElement>
				MaterialDialog.executingActionAdaptersByComponent.get(PrimaryButtonConstructor)?.(this.primaryActionElement, this.executingAction === 'primary')
			}

			if (this.secondaryActionElement) {
				const SecondaryButtonConstructor = this.secondaryActionElement.constructor as Constructor<HTMLElement>
				MaterialDialog.executingActionAdaptersByComponent.get(SecondaryButtonConstructor)?.(this.secondaryActionElement, this.executingAction === 'secondary')
			}
		}
	}) executingAction?: DialogActionKey

	@query('.mdc-dialog__surface') private readonly surfaceElement!: HTMLDivElement
	@query('footer') private readonly footerElement!: HTMLElement

	@query('#divHeaderOptions mo-icon-button[icon=close]') readonly cancellationActionElement!: IconButton

	handleAction!: (key: DialogActionKey) => void | Promise<void>

	get primaryActionElement() {
		return this.querySelector<HTMLElement>('[slot=primaryAction]') ?? this.renderRoot.querySelector<HTMLElement>('slot[name=primaryAction] > *') ?? undefined
	}

	get secondaryActionElement() {
		return this.querySelector<HTMLElement>('[slot=secondaryAction]') ?? this.renderRoot.querySelector<HTMLElement>('slot[name=secondaryAction] > *') ?? undefined
	}

	get isActiveDialog(): boolean {
		return MoDeL.application.dialogHost.focusedDialogComponent?.dialogElement === this
	}

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mdc-dialog-heading-ink-color: var(--mo-color-foreground);
					--mdc-dialog-content-ink-color: var(--mo-color-foreground-transparent);
					--mdc-dialog-scroll-divider-color: var(--mo-color-gray-transparent);
					--mdc-dialog-scrim-color: var(--mo-scrim);
				}

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

				.mdc-dialog__surface {
					max-width: var(--mdc-dialog-max-width) !important;
					width: 100vw;
					min-height: var(--mdc-dialog-min-height);
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

	@eventListener({ target: document, type: 'keydown' })
	protected async handleKeyDown(e: KeyboardEvent) {
		if (this.isActiveDialog) {
			if (this.primaryOnEnter === true && e.key === KeyboardKey.Enter) {
				(document.deepActiveElement as HTMLElement).blur()
				await this.handleAction(DialogActionKey.Primary)
			}
		}
	}

	@eventListener({ target: window, type: 'beforeunload' })
	protected handleBeforeUnload() {
		if (this.boundToWindow) {
			this.handleAction(DialogActionKey.Cancellation)
		}
	}

	protected override initialized() {
		this.createHeaderSlot()
		this.createFooterSlot()
		this['contentElement'].setAttribute('part', 'content')
		this.footerElement.setAttribute('part', 'footer')
		this.renderRoot.querySelector('.mdc-dialog__scrim')?.setAttribute('part', 'scrim')

		this.changeCloseBehavior()

		this.primarySlot.addEventListener('click', () => this.handleAction(DialogActionKey.Primary))
		this.secondarySlot.addEventListener('click', () => this.handleAction(DialogActionKey.Secondary))
	}

	protected override updated(props: PropertyValues<this>) {
		super.updated(props)
		this.decideFooterVisibility()
		if (props.has('heading')) {
			this.dialogHeadingChange.dispatch(this.heading)
		}
	}

	private decideFooterVisibility() {
		const hideFooter = !this.primaryActionElement
			&& !this.secondaryActionElement
			&& this.renderRoot.querySelector<HTMLSlotElement>('slot[name=footer]')?.assignedElements().length === 0
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
				this.handleAction(action as DialogActionKey)
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
			${this.boundToWindow || !this.poppable ? nothing : html`<mo-icon-button icon='launch' @click=${() => this.requestPopup.dispatch()}></mo-icon-button>`}
			${this.boundToWindow || this.blocking ? nothing : html`<mo-icon-button icon='close' @click=${() => this.handleAction(DialogActionKey.Cancellation)}></mo-icon-button>`}
		`
	}

	@renderContainer('slot[name="primaryAction"]')
	protected get primaryButtonTemplate() {
		return !this.primaryButtonText ? nothing : html`
			<mo-loading-button type='raised'>
				${this.primaryButtonText}
			</mo-loading-button>
		`
	}

	@renderContainer('slot[name="secondaryAction"]')
	protected get secondaryButtonTemplate() {
		return !this.secondaryButtonText ? nothing : html`
			<mo-loading-button>
				${this.secondaryButtonText}
			</mo-loading-button>
		`
	}

	// @ts-expect-error The base close method is a utility method and won't be called
	override close(result: TResult | Error) {
		super.close()
		if (this.boundToWindow) {
			window.close()
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog': MaterialDialog
	}
}