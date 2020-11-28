import { component, html } from '..'
import { DialogComponent } from '.'

@component('mo-dialog-default')
export default class DialogDefault extends DialogComponent<{ header: string, content: string, primaryButtonText?: string, secondaryButtonText?: string }> {
	protected render() {
		return html`
			<mo-dialog header=${this.parameters.header} primaryButtonText=${this.parameters.primaryButtonText ?? 'OK'} secondaryButtonText=${this.parameters.secondaryButtonText ?? 'Cancel'}>
				<mo-div margin='0'>${this.parameters.content}</mo-div>
			</mo-dialog>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog-default': DialogDefault
	}
}