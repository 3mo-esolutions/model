import { component, html, state } from '../../library'
import { PageComponent, route } from '../page'
import { DialogComponent } from '.'

@route(PageDialog.route)
@component(PageDialog.tag)
export class PageDialog extends PageComponent {
	static readonly tag = 'mo-page-dialog'
	static readonly route = '/dialog'

	@state() heading = ''

	protected override get template() {
		return html`<mo-page heading=${this.heading}></mo-page>`
	}

	async confirmDialog<T>(dialog: DialogComponent<any, T>) {
		dialog.headingChange.subscribe(heading => this.heading = heading)
		const confirmPromise = dialog.confirm()
		await dialog.updateComplete
		if (dialog.dialogElement) {
			dialog.dialogElement.boundToWindow = true
			this.heading = dialog.dialogElement.heading
		}
		return confirmPromise
	}
}