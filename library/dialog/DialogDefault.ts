import { component, html } from '..'
import { DialogComponent } from '.'

@component('mdc-dialog-default')
export default class DialogDefault extends DialogComponent<{ header: string, content: string, primaryButtonText?: string, secondaryButtonText?: string }> {
	protected render() {
		return html`
			<mdc-dialog header=${this.parameters.header} primaryButtonText=${this.parameters.primaryButtonText ?? 'OK'} secondaryButtonText=${this.parameters.secondaryButtonText ?? 'Cancel'}>
				<mdc-div margin='0'>${this.parameters.content}</mdc-div>
			</mdc-dialog>
		`
	}
}