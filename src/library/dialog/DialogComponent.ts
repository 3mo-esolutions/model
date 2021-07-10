import { Component, DialogHost, PropertyValues, event, Dialog } from '..'
import { ComponentConstructor } from '../component'

export type DialogParameters = void | Record<string, any>

export interface DialogComponentConstructor<T extends DialogParameters> extends Constructor<DialogComponent<T>>, ComponentConstructor {
	authorizations: Array<keyof MoDeL.Authorizations>
}

export abstract class DialogComponent<T extends DialogParameters = void, TResult = void> extends Component {
	static authorizations = new Array<keyof MoDeL.Authorizations>()

	@event() readonly closed!: IEvent<TResult | Error>

	['constructor']: DialogComponentConstructor<T>

	constructor(protected readonly parameters = {} as T) {
		super()
	}

	confirm(): Promise<TResult> {
		return DialogHost.instance.confirm(this)
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

	protected firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		if (this.dialog === undefined) {
			throw new Error(`${this.constructor.name} does not wrap its content in a 'mo-dialog' element`)
		}
		this.open = true
		this.dialog.primaryAction = this.primaryButtonAction.bind(this.dialog)
		this.dialog.secondaryAction = this.secondaryButtonAction?.bind(this.dialog)
		this.dialog.cancellationAction = this.cancellationAction?.bind(this.dialog)
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