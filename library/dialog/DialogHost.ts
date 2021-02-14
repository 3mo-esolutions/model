import { Component, component, Snackbar } from '..'
import { DialogComponent, DialogDefault } from '.'
import { LocalStorageEntry, PermissionHelper } from '../../helpers'

type DefaultDialogParameters = [header: string, content: string, primaryButtonText?: string, secondaryButtonText?: string]

@component('mo-dialog-host')
export class DialogHost extends Component {
	static readonly DeletionConfirmation = new LocalStorageEntry('MoDeL.DeletionConfirmation', true)

	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-dialog-host') as DialogHost }

	static get openDialog() { return this.instance.openDialog }
	static get confirmDialog() { return this.instance.confirmDialog }
	static get open() { return this.instance.open }
	static get confirm() { return this.instance.confirm }
	static get confirmDeletionIfNecessary() { return this.instance.confirmDeletionIfNecessary }

	private confirmDeletionIfNecessary = async (text: string) => {
		if (DialogHost.DeletionConfirmation.value === false)
			return

		await this.confirm('Confirm Deletion', text)
	}

	private open = async (...parameters: DefaultDialogParameters) => {
		return await new DialogDefault({
			header: parameters[0],
			content: parameters[1],
			primaryButtonText: parameters[2],
			secondaryButtonText: parameters[3],
		}).open()
	}

	private confirm = async (...parameters: DefaultDialogParameters) => {
		await new DialogDefault({
			header: parameters[0],
			content: parameters[1],
			primaryButtonText: parameters[2],
			secondaryButtonText: parameters[3],
		}).confirm()
	}

	private confirmDialog = async <T extends DialogComponent<TParams>, TParams>(dialog: T) => {
		const response = await this.openDialog(dialog)
		if (response === false) {
			throw new Error('Dialog canceled')
		}
	}

	private openDialog = async <T extends DialogComponent<TParams>, TParams>(dialog: T) => {
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