import { Component, component, Snackbar } from '..'
import { DialogComponent, DialogDefault } from '.'
import { PermissionHelper, StorageContainer } from '../../helpers'

type DefaultDialogParameters = [header: string, content: string, primaryButtonText?: string, secondaryButtonText?: string]

@component('mo-dialog-host')
export default class DialogHost extends Component {
	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-dialog-host') as DialogHost }

	static get openDialog() { return this.instance.openDialog.bind(this.instance) }
	static get confirmDialog() { return this.instance.confirmDialog.bind(this.instance) }
	static get open() { return this.instance.open.bind(this.instance) }
	static get confirm() { return this.instance.confirm.bind(this.instance) }
	static get confirmDeletionIfNecessary() { return this.instance.confirmDeletionIfNecessary.bind(this.instance) }

	private async confirmDeletionIfNecessary(text: string): Promise<void> {
		if (StorageContainer.DeletionConfirmation.value === false)
			return

		await this.confirm('Confirm Deletion', text)
	}

	private async open(...parameters: DefaultDialogParameters) {
		return await new DialogDefault({
			header: parameters[0],
			content: parameters[1],
			primaryButtonText: parameters[2],
			secondaryButtonText: parameters[3],
		}).open()
	}

	private async confirm(...parameters: DefaultDialogParameters) {
		await new DialogDefault({
			header: parameters[0],
			content: parameters[1],
			primaryButtonText: parameters[2],
			secondaryButtonText: parameters[3],
		}).confirm()
	}

	private async confirmDialog<T extends DialogComponent<TParams>, TParams>(dialog: T) {
		const response = await this.openDialog(dialog)
		if (response === false) {
			throw new Error('Dialog canceled')
		}
	}

	private async openDialog<T extends DialogComponent<TParams>, TParams>(dialog: T) {
		if (PermissionHelper.isAuthorized(...dialog.constructor.permissions) === false) {
			Snackbar.show('🔒 Access denied')
			return false
		}

		this.shadowRoot.append(dialog)
		return new Promise<boolean>(resolve => dialog.closed.subscribe(result => {
			resolve(result)
			dialog.remove()
			if (Array.from(this.shadowRoot.children).filter(child => child.tagName.toLowerCase() !== 'style').length === 0) {
				document.body.style.overflow = 'auto'
			}
		}))
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog-host': DialogHost
	}
}