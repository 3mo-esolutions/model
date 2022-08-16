import { component, html, ifDefined } from '../../library'
import { DialogComponent } from '../../shell'
import { BaseDialogParameters } from './BaseDialogParameters'

@component('mo-dialog-alert')
export class DialogAlert extends DialogComponent<BaseDialogParameters> {
	protected override get template() {
		return html`
			<mo-dialog
				heading=${this.parameters.heading}
				primaryButtonText=${this.parameters.primaryButtonText ?? _('OK')}
				?blocking=${this.parameters.blocking}
				size=${ifDefined(this.parameters.size)}
				primaryOnEnter
			>
				${this.parameters.content}
			</mo-dialog>
		`
	}

	protected override primaryAction() { }
}