import { Component, PropertyValues, event, } from '../../library'
import { Dialog, DialogCancelledError, eventListener, LocalStorageEntry, PageDialog, querySymbolizedElement } from '../..'
import { DialogActionKey } from './Dialog'

export type DialogParameters = void | Record<string, any>

export type DialogResult<TResult> = TResult | Error

export type DialogAction<TResult> = DialogResult<TResult> | PromiseLike<DialogResult<TResult>>

export const enum DialogConfirmationStrategy { Dialog, Tab, Window }

export abstract class DialogComponent<T extends DialogParameters = void, TResult = void> extends Component {
	static readonly poppableConfirmationStrategy = new LocalStorageEntry<DialogConfirmationStrategy>('MoDeL.Components.DialogComponent.PoppableConfirmationStrategy', DialogConfirmationStrategy.Dialog)
	private static readonly dialogElementConstructorSymbol = Symbol('DialogComponent.DialogElementConstructor')

	static dialogElement() {
		return (constructor: Constructor<Dialog>) => {
			(constructor as any)[DialogComponent.dialogElementConstructorSymbol] = true
		}
	}

	@event() readonly closed!: EventDispatcher<TResult | Error>

	@querySymbolizedElement(DialogComponent.dialogElementConstructorSymbol) readonly dialogElement!: Dialog
	get primaryActionElement() { return this.dialogElement.primaryActionElement }
	get secondaryActionElement() { return this.dialogElement.secondaryActionElement }
	get cancellationActionElement() { return this.dialogElement.cancellationActionElement }

	constructor(readonly parameters: T) {
		super()
	}

	@eventListener({ target: window, type: 'beforeunload' })
	protected async handleBeforeUnload() {
		if (this.dialogElement.boundToWindow) {
			await this.handleAction(DialogActionKey.Cancellation)
		}
	}

	@eventListener({ target: document, type: 'keydown' })
	protected async handleKeyDown(e: KeyboardEvent) {
		if (MoDeL.application.dialogHost.focusedDialogComponent === this) {
			if (this.dialogElement.primaryOnEnter === true && e.key === KeyboardKey.Enter) {
				(document.deepActiveElement as HTMLElement).blur()
				await this.handleAction(DialogActionKey.Primary)
			}

			if (!this.dialogElement.preventCancellationOnEscape && e.key === KeyboardKey.Escape) {
				await this.handleAction(DialogActionKey.Cancellation)
			}
		}
	}

	confirm(strategy?: DialogConfirmationStrategy): Promise<TResult> {
		return MoDeL.application.dialogHost.confirm(this, strategy)
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	private _minimized = false

	protected async pop(strategy: Exclude<DialogConfirmationStrategy, DialogConfirmationStrategy.Dialog> = DialogConfirmationStrategy.Tab) {
		this._minimized = true
		this.open = false
		const value = await this.confirm(strategy)
		this._minimized = false
		this.close(value)
	}

	protected close(result: TResult | Error) {
		if (this._minimized === false) {
			this.open = false
			this.closed.dispatch(result)
		}
	}

	private get open() { return this.dialogElement.open }
	private set open(value) { this.dialogElement.open = value }

	protected override firstUpdated(props: PropertyValues) {
		this.dialogElement.handleAction = this.handleAction
		this.dialogElement.requestPopup?.subscribe(() => this.pop())

		if (this.dialogElement.poppable &&
			Router.path !== PageDialog.route &&
			DialogComponent.poppableConfirmationStrategy.value !== DialogConfirmationStrategy.Dialog
		) {
			this.pop(DialogComponent.poppableConfirmationStrategy.value)
			return
		}

		this.open = true
		super.firstUpdated(props)
	}

	protected primaryAction(): DialogAction<TResult> {
		throw new NotImplementedError()
	}

	protected secondaryAction(): DialogAction<TResult> {
		return this.cancellationAction()
	}

	protected cancellationAction(): DialogAction<TResult> {
		return new DialogCancelledError()
	}

	private readonly handleAction = async (actionKey: DialogActionKey) => {
		const actionByKey = new Map([
			[DialogActionKey.Primary, this.primaryAction],
			[DialogActionKey.Secondary, this.secondaryAction],
			[DialogActionKey.Cancellation, this.cancellationAction],
		])

		// eslint-disable-next-line no-restricted-syntax
		const action = actionByKey.get(actionKey)?.bind(this)

		if (!action) {
			throw new Error(`No action for key ${actionKey}`)
		}

		try {
			this.dialogElement.executingAction = actionKey
			const result = await action()
			if (!this.dialogElement.manualClose) {
				this.close(result)
				if (this.dialogElement.boundToWindow) {
					window.close()
				}
			}
		} catch (e: any) {
			MoDeL.application.notificationHost.notifyError(e.message)
			throw e
		} finally {
			this.dialogElement.executingAction = undefined
		}
	}
}