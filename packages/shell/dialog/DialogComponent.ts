import { Component, PropertyValues, event, } from '../../library'
import { Dialog, LocalStorageEntry, PageDialog, query } from '../..'

export type DialogParameters = void | Record<string, any>

export const enum DialogConfirmationStrategy { Dialog, Tab, Window }

export abstract class DialogComponent<T extends DialogParameters = void, TResult = void> extends Component {
	static readonly poppableConfirmationStrategy = new LocalStorageEntry<DialogConfirmationStrategy>('MoDeL.Components.DialogComponent.PoppableConfirmationStrategy', DialogConfirmationStrategy.Dialog)

	@event() readonly closed!: EventDispatcher<TResult | Error>
	@event() readonly headingChange!: EventDispatcher<string>

	@query('mo-dialog') readonly dialogElement!: Dialog<TResult>

	constructor(readonly parameters: T) {
		super()
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

	get primaryButton() {
		return this.dialogElement.primaryButton
	}

	get secondaryButton() {
		return this.dialogElement.secondaryButton
	}

	protected close(result: TResult | Error) {
		this.dialogElement.close(result)
		this.open = false
	}

	private get open() { return this.dialogElement.open }
	private set open(value) { this.dialogElement.open = value }

	protected override firstUpdated(props: PropertyValues) {
		if (this.dialogElement === undefined) {
			throw new Error(`${this.constructor.name} does not wrap its content in a 'mo-dialog' element`)
		}

		this.dialogElement.primaryAction = this.primaryButtonAction.bind(this)
		this.dialogElement.secondaryAction = this.secondaryButtonAction?.bind(this)
		this.dialogElement.cancellationAction = this.cancellationAction?.bind(this)
		this.dialogElement.headingChange.subscribe(heading => this.headingChange.dispatch(heading))
		this.dialogElement.requestPopup.subscribe(() => this.pop())
		this.dialogElement.addEventListener<any>('closed', (e: CustomEvent<TResult>) => {
			// Google MWC has events in some of their components
			// which dispatch a "closed" event with "bubbles" option set to true
			// thus reaching the DialogComponent. This is blocked here.
			const eventSourceWasNotDialog = (e.source instanceof Dialog) === false

			if (eventSourceWasNotDialog || this._minimized) {
				e.stopImmediatePropagation()
				return
			}

			this.closed.dispatch(e.detail)
		})

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

	protected primaryButtonAction(): TResult | PromiseLike<TResult> {
		throw new Error('Not implemented')
	}

	protected secondaryButtonAction?(): TResult | PromiseLike<TResult>

	protected cancellationAction?(): TResult | PromiseLike<TResult>
}