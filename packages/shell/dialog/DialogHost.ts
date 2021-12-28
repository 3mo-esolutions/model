import { Component, component } from '../../library'
import { DialogComponent, Snackbar, AuthorizationHelper } from '..'

@component('mo-dialog-host')
export class DialogHost extends Component {
	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-dialog-host') as DialogHost }

	get dialogComponents() {
		return Array.from(this.shadowRoot.querySelectorAll('*'))
			.filter(element => element instanceof DialogComponent) as Array<DialogComponent>
	}

	protected override initialized() {
		this.registerKeyListeners()
	}

	private registerKeyListeners() {
		// All default behaviors of the MWC Dialogs related to keydown event has been disabled.
		// So the host is now responsible to make sure those functions still work
		document.addEventListener('keydown', async (e) => {
			const lastDialog = this.dialogComponents[this.dialogComponents.length - 1]?.['dialog']
			if (lastDialog !== undefined) {
				if (lastDialog.blocking === false && e.key === KeyboardKey.Escape) {
					lastDialog.close()
					e.stopImmediatePropagation()
				}

				if (lastDialog.primaryOnEnter === true && e.key === KeyboardKey.Enter) {
					(document.deepActiveElement as HTMLElement).blur()
					await lastDialog['handlePrimaryButtonClick']()
				}
			}
		})
	}

	confirm<T extends DialogComponent<TParams, TResult>, TParams, TResult>(dialog: T) {
		MoDeL.application.closeDrawerIfDismissible()

		if (AuthorizationHelper.isAuthorized(...dialog.constructor.authorizations) === false) {
			const errorMessage = '🔒 Access denied'
			Snackbar.show(errorMessage)
			return Promise.reject(new Error(errorMessage))
		}

		this.shadowRoot.append(dialog)
		return new Promise<TResult>((resolve, reject) => {
			dialog.closed.subscribe(result => {
				if (result instanceof Error) {
					reject(result)
				} else {
					resolve(result)
				}
				dialog.remove()
				if (this.dialogComponents.length === 0) {
					document.body.style.overflow = 'auto'
				}
			})
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog-host': DialogHost
	}
}