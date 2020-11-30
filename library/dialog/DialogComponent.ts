/* eslint-disable @typescript-eslint/ban-types */
import { Component, DialogHost } from '..'

export type DialogParameters = void | Record<string, any>

export type DialogComponentConstructor<T extends DialogParameters> = Constructor<DialogComponent<T>> & { permissions: Array<keyof MoDeL.Permissions> }

export abstract class DialogComponent<T extends DialogParameters = void> extends Component {
	['constructor']: DialogComponentConstructor<T>

	static permissions = new Array<keyof MoDeL.Permissions>()

	@eventProperty readonly closed!: IEvent<boolean>

	async open(): Promise<boolean> {
		return await DialogHost.openDialog(this)
	}

	async confirm(): Promise<void> {
		return await DialogHost.confirmDialog(this)
	}

	constructor(parameters: T) {
		super()
		this.parameters = parameters as T
	}

	protected readonly parameters: T

	protected get dialog() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.shadowRoot.querySelector('mo-dialog')!
	}

	protected initialized() {
		this.isOpen = true
		this.dialog?.finished.subscribe(result => this.closed.trigger(result))
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
}