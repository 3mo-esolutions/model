import { Component, component, css, html } from '../../library'
import { WindowHelper, WindowOpenMode } from '../../utilities'
import { DialogComponent, AuthorizationHelper, PageDialog, DialogConfirmationStrategy, NotificationHost } from '..'

@component('mo-dialog-host')
export class DialogHost extends Component {
	static override get styles() {
		return css`:host { z-index: 7; }`
	}

	private readonly dialogComponents = new Set<DialogComponent<any, any>>()

	async confirm<T extends DialogComponent<TParams, TResult>, TParams, TResult>(dialog: T, strategy = DialogConfirmationStrategy.Dialog) {
		if (AuthorizationHelper.componentAuthorized(dialog) === false) {
			NotificationHost.instance.notifyAndThrowError('🔒 Access denied')
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

	private confirmDialog<T extends DialogComponent<TParams, TResult>, TParams, TResult>(dialogComponent: T) {
		MoDeL.application.closeDrawerIfDismissible()

		this.dialogComponents.add(dialogComponent)
		this.requestUpdate()

		return new Promise<TResult>((resolve, reject) => {
			dialogComponent.closed.subscribe(result => {
				if (result instanceof Error) {
					reject(result)
				} else {
					resolve(result)
				}
				this.dialogComponents.delete(dialogComponent)
				this.requestUpdate()
				if (this.dialogComponents.size === 0) {
					document.body.style.removeProperty('overflow')
				}
			})
		})
	}

	get focusedDialogComponent() {
		return [...this.dialogComponents][this.dialogComponents.size - 1]
	}

	protected override get template() {
		return html`${this.dialogComponents}`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog-host': DialogHost
	}
}