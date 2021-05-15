import { component, html, TemplateResult } from '..'
import { DialogComponent } from '.'

type Parameters = {
	readonly header: string
	readonly content: string | TemplateResult
	readonly primaryButtonText?: string
	readonly secondaryButtonText?: string
	readonly blocking?: boolean
}

@component('mo-dialog-default')
export class DialogDefault extends DialogComponent<Parameters> {
	protected render() {
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
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-dialog-default': DialogDefault
	}
}