import { Component, component } from '../../library'
import { DialogComponent, Snackbar, AuthorizationHelper } from '..'

@component('mo-dialog-host')
export class DialogHost extends Component {
	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-dialog-host') as DialogHost }

	get dialogComponents() {
		return Array.from(this.shadowRoot.querySelectorAll('*'))
			.filter((element): element is DialogComponent<any, any> => element instanceof DialogComponent)
	}

	get focusedDialogComponent() {
		return this.dialogComponents.length === 0 ? undefined : this.dialogComponents[this.dialogComponents.length - 1]
	}

	confirm<T extends DialogComponent<TParams, TResult>, TParams, TResult>(dialog: T) {
		MoDeL.application.closeDrawerIfDismissible()

		if (AuthorizationHelper.componentAuthorized(dialog) === false) {
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
					document.body.style.removeProperty('overflow')
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