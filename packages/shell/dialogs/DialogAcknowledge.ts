import { component, html, TemplateResult } from '../../library'
import { DialogComponent } from '..'

type Parameters = {
	readonly header: string
	readonly content: string | TemplateResult
	readonly primaryButtonText?: string
	readonly secondaryButtonText?: string
	readonly blocking?: boolean
}

@component('eb-dialog-acknowledge')
export class DialogAcknowledge extends DialogComponent<Parameters, boolean> {
	protected override get template() {
		return html`
			<mo-dialog
				header=${this.parameters.header}
				primaryButtonText=${this.parameters.primaryButtonText ?? 'OK'}
				secondaryButtonText=${this.parameters.secondaryButtonText ?? 'Abbrechen'}
				?blocking=${this.parameters.blocking}
				primaryOnEnter
			>
				${this.parameters.content}
			</mo-dialog>
		`
	}

	protected override primaryButtonAction = () => true

	protected override secondaryButtonAction = () => false
}