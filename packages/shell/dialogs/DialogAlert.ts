import { component, html, TemplateResult } from '../../library'
import { DialogComponent } from '..'

type Parameters = {
	readonly header: string
	readonly content: string | TemplateResult
	readonly primaryButtonText?: string
	readonly blocking?: boolean
}

@component('eb-dialog-alert')
export class DialogAlert extends DialogComponent<Parameters> {
	protected override get template() {
		return html`
			<mo-dialog
				header=${this.parameters.header}
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