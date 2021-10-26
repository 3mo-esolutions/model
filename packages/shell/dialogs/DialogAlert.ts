import { component, html } from '../../library'
import { DialogComponent } from '..'
import { BaseDialogParameters } from './BaseDialogParameters'

@component('eb-dialog-alert')
export class DialogAlert extends DialogComponent<BaseDialogParameters> {
	protected override get template() {
		return html`
			<mo-dialog
				heading=${this.parameters.heading}
				primaryButtonText=${this.parameters.primaryButtonText ?? 'OK'}
				?blocking=${this.parameters.blocking}
				primaryOnEnter
			>
				${this.parameters.content}
			</mo-dialog>
		`
	}

	protected override primaryButtonAction() { }
}