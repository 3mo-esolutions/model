import { Component, DialogHost, PropertyValues, event } from '..'
import { ComponentConstructor } from '../component'

export type DialogParameters = void | Record<string, any>

export interface DialogComponentConstructor<T extends DialogParameters> extends Constructor<DialogComponent<T>>, ComponentConstructor {
	authorizations: Array<keyof MoDeL.Authorizations>
}

export abstract class DialogComponent<T extends DialogParameters = void> extends Component {
	static authorizations = new Array<keyof MoDeL.Authorizations>()

	@event() readonly closed!: IEvent<boolean>

	['constructor']: DialogComponentConstructor<T>

	protected readonly parameters = {} as T

	constructor(parameters: T) {
		super()
		this.parameters = parameters as T
	}

	open(): Promise<boolean> {
		return DialogHost.instance.open(this)
	}

	async confirm() {
		const response = await this.open()
		if (response === false) {
			throw new Error('Dialog canceled')
		}
	}

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
		this.dialog.finished.subscribe(result => this.closed.dispatch(result))
	}

	protected executePrimaryAction = () => this.dialog?.['handlePrimaryButtonClick']()

	protected executeSecondaryAction = () => this.dialog?.['handleSecondaryButtonClick']()
}