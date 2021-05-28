import { component, html, ifDefined, TemplateResult } from '..'
import { DialogComponent, DialogSize } from '.'

type Parameters = {
	readonly header: string
	readonly content: string | TemplateResult
	readonly primaryButtonText?: string
	readonly secondaryButtonText?: string
	readonly size?: DialogSize
	readonly blocking?: boolean
}

@component('mo-dialog-default')
export class DialogDefault extends DialogComponent<Parameters> {
	protected override render() {
		return html`
			<mo-dialog
				header=${this.parameters.header}
				size=${ifDefined(this.parameters.size)}
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