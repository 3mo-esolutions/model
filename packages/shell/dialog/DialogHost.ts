import { Component, component } from '../../library'
import { WindowHelper, WindowOpenMode } from '../../utilities'
import { DialogComponent, Snackbar, AuthorizationHelper, PageDialog, DialogConfirmationStrategy, SnackbarType } from '..'

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

	async confirm<T extends DialogComponent<TParams, TResult>, TParams, TResult>(dialog: T, strategy = DialogConfirmationStrategy.Dialog) {
		if (AuthorizationHelper.componentAuthorized(dialog) === false) {
			const errorMessage = '🔒 Access denied'
			Snackbar.show(SnackbarType.Error, errorMessage)
			throw new Error(errorMessage)
		}

		if (strategy === DialogConfirmationStrategy.Dialog) {
			return this.confirmDialog<T, TParams, TResult>(dialog)
		}

		const Constructor = dialog.constructor as unknown as typeof DialogComponent
		const propertiesToCopy = Array.from(Constructor.elementProperties.keys())
		const popupWindow = await WindowHelper.open(PageDialog.route, strategy === DialogConfirmationStrategy.Window ? WindowOpenMode.Window : WindowOpenMode.Tab)

		const DialogConstructor = popupWindow.customElements.get(dialog.tagName.toLowerCase()) as CustomElementConstructor
		const dialogComponent = new DialogConstructor(dialog.parameters) as DialogComponent<T, TResult>
		// @ts-expect-error property is a key of the elementProperties map
		propertiesToCopy.forEach((property) => dialogComponent[property] = dialog[property])

		await popupWindow.window.MoDeL.application.pageHost.updateComplete
		const page = popupWindow.window.MoDeL.application.pageHost.currentPage as PageDialog
		return page.confirmDialog(dialogComponent)
	}

	private confirmDialog<T extends DialogComponent<TParams, TResult>, TParams, TResult>(dialog: T) {
		MoDeL.application.closeDrawerIfDismissible()

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