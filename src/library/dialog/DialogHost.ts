import { Component, component, Snackbar } from '..'
import { DialogComponent } from '.'
import { AuthorizationHelper } from '../../helpers'

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

	open<T extends DialogComponent<TParams>, TParams>(dialog: T) {
		if (AuthorizationHelper.isAuthorized(...dialog.constructor.authorizations) === false) {
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