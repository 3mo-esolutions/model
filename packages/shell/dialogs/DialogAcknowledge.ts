import { component, html, ifDefined } from '../../library'
import { DialogComponent } from '..'
import { BaseDialogParameters } from './BaseDialogParameters'

type Parameters = BaseDialogParameters & { readonly secondaryButtonText?: string }

@component('mo-dialog-acknowledge')
export class DialogAcknowledge extends DialogComponent<Parameters, boolean> {
	protected override get template() {
		return html`
			<mo-dialog
				heading=${this.parameters.heading}
				primaryButtonText=${this.parameters.primaryButtonText ?? 'OK'}
				secondaryButtonText=${this.parameters.secondaryButtonText ?? 'Abbrechen'}
				?blocking=${this.parameters.blocking}
				size=${ifDefined(this.parameters.size)}
				primaryOnEnter
			>
				${this.parameters.content}
			</mo-dialog>
		`
	}

	protected override primaryButtonAction = () => true

	protected override secondaryButtonAction = () => false
}