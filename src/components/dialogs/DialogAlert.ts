import { component, DialogComponent, html, TemplateResult } from '../../library'

type Parameters = {
	readonly header: string
	readonly content: string | TemplateResult
	readonly primaryButtonText?: string
	readonly blocking?: boolean
}

@component('eb-dialog-alert')
export class DialogAlert extends DialogComponent<Parameters> {
	protected override render = () => html`
		<mo-dialog
			header=${this.parameters.header}
			primaryButtonText=${this.parameters.primaryButtonText ?? 'OK'}
			?blocking=${this.parameters.blocking}
			primaryOnEnter
		>
			${this.parameters.content}
		</mo-dialog>
	`

	protected override primaryButtonAction() { }
}