import { Component, DialogHost, PropertyValues } from '..'
import { ComponentConstructor } from '../component'

export type DialogParameters = void | Record<string, any>

export interface DialogComponentConstructor<T extends DialogParameters> extends Constructor<DialogComponent<T>>, ComponentConstructor {
	permissions: Array<keyof MoDeL.Permissions>
}

export abstract class DialogComponent<T extends DialogParameters = void> extends Component {
	['constructor']: DialogComponentConstructor<T>

	static permissions = new Array<keyof MoDeL.Permissions>()

	@eventProperty() readonly closed!: IEvent<boolean>

	open(): Promise<boolean> {
		return DialogHost.openDialog(this)
	}

	confirm(): Promise<void> {
		return DialogHost.confirmDialog(this)
	}

	constructor(parameters: T) {
		super()
		this.parameters = parameters as T
	}

	protected readonly parameters = {} as T

	protected get dialog() {
		return this.shadowRoot.querySelector('mo-dialog') ?? undefined
	}

	protected close() {
		this.isOpen = false
	}

	private get isOpen() { return this.dialog?.open ?? false }
	private set isOpen(value) {
		if (this.dialog) {
			this.dialog.open = value
		}
	}

	protected firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		if (this.dialog === undefined) {
			throw new Error(`${this.constructor.name} does not wrap its content in a 'mo-dialog' element`)
		}
		this.isOpen = true
		this.dialog?.finished.subscribe(result => this.closed.trigger(result))
	}
}