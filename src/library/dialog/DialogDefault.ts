import { component, html } from '..'
import { DialogComponent } from '.'

@component('mo-dialog-default')
export class DialogDefault extends DialogComponent<{ header: string, content: string, primaryButtonText?: string, secondaryButtonText?: string, blocking?: boolean }> {
	protected render = () => html`
		<mo-dialog
			header=${this.parameters.header}
			primaryButtonText=${this.parameters.primaryButtonText ?? 'OK'}
			secondaryButtonText=${this.parameters.secondaryButtonText ?? 'Abbrechen'}
			?blocking=${this.parameters.blocking}
			primaryOnEnter
		>
			<mo-div margin='0'>${this.parameters.content}</mo-div>
		</mo-dialog>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog-default': DialogDefault
	}
}