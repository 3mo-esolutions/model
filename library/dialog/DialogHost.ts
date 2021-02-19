import { Component, component, Snackbar } from '..'
import { DialogComponent, DialogDefault } from '.'
import { LocalStorageEntry, PermissionHelper } from '../../helpers'
import { KeyboardKey } from '../../types'

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

	get dialogComponents() {
		return Array.from(this.shadowRoot.querySelectorAll('*'))
			.filter(element => element instanceof DialogComponent) as Array<DialogComponent>
	}

	protected initialized() {
		this.registerKeyListeners()
	}

	private registerKeyListeners() {
		// All default behaviors of the MWC Dialogs related to keydown event has been disabled.
		// So the host is now responsible to make sure those functions still work
		document.addEventListener('keydown', async (e) => {
			const lastDialog = this.dialogComponents[this.dialogComponents.length - 1]?.['dialog']
			if (lastDialog !== undefined) {
				if (lastDialog?.blocking === false && e.key === KeyboardKey.Escape) {
					lastDialog.close()
					e.stopImmediatePropagation()
				}

				if (lastDialog.primaryOnEnter === true && e.key === KeyboardKey.Enter) {
					await lastDialog['handlePrimaryButtonClick']()
				}
			}
		})
	}

	private confirmDeletionIfNecessary = async (text: string) => {
		if (DialogHost.DeletionConfirmation.value === false)
			return

		await this.confirm('Confirm Deletion', text)
	}

	private open = (...parameters: DefaultDialogParameters) => {
		return new DialogDefault({
			header: parameters[0],
			content: parameters[1],
			primaryButtonText: parameters[2],
			secondaryButtonText: parameters[3],
		}).open()
	}

	private confirm = (...parameters: DefaultDialogParameters) => {
		return new DialogDefault({
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

	private openDialog = <T extends DialogComponent<TParams>, TParams>(dialog: T) => {
		if (PermissionHelper.isAuthorized(...dialog.constructor.permissions) === false) {
			Snackbar.show('🔒 Access denied')
			return Promise.reject('🔒 Access denied')
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