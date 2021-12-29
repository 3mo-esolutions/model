import { Component, PropertyValues, event, } from '../../library'
import { Dialog } from '../..'

export type DialogParameters = void | Record<string, any>

export abstract class DialogComponent<T extends DialogParameters = void, TResult = void> extends Component {
	@event() readonly closed!: EventDispatcher<TResult | Error>

	constructor(protected readonly parameters: T) {
		super()
	}

	confirm(): Promise<TResult> {
		return MoDeL.application.dialogHost.confirm(this)
	}

	protected get dialog() {
		return this.shadowRoot.querySelector<Dialog<TResult>>('mo-dialog') ?? undefined
	}

	get primaryButton() {
		return this.dialog?.primaryButton
	}

	get secondaryButton() {
		return this.dialog?.secondaryButton
	}

	protected close(result: TResult | Error) {
		this.dialog?.close(result)
		this.open = false
	}

	private get open() { return this.dialog?.open ?? false }
	private set open(value) {
		if (this.dialog) {
			this.dialog.open = value
		}
	}

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		if (this.dialog === undefined) {
			throw new Error(`${this.constructor.name} does not wrap its content in a 'mo-dialog' element`)
		}
		this.open = true
		this.dialog.primaryAction = this.primaryButtonAction.bind(this)
		this.dialog.secondaryAction = this.secondaryButtonAction?.bind(this)
		this.dialog.cancellationAction = this.cancellationAction?.bind(this)
		this.dialog.addEventListener('closed', (e: CustomEvent<TResult>) => {
			// Google MWC has events in some of their components
			// which dispatch a "closed" event with "bubbles" option set to true
			// thus reaching the DialogComponent. This is blocked here.
			if ((e.source instanceof Dialog) === false) {
				e.stopImmediatePropagation()
				return
			}
			this.closed.dispatch(e.detail)
		})
	}

	protected primaryButtonAction(): TResult | PromiseLike<TResult> {
		throw new Error('Not implemented')
	}

	protected secondaryButtonAction?(): TResult | PromiseLike<TResult>

	protected cancellationAction?(): TResult | PromiseLike<TResult>
}