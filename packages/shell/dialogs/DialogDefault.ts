import { component, html, ifDefined, TemplateResult } from '../../library'
import { DialogComponent, DialogSize } from '..'

type Parameters<TResult> = {
	readonly header: string
	readonly content: string | TemplateResult
	readonly primaryButtonText?: string
	readonly primaryButtonAction?: () => TResult | PromiseLike<TResult>
	readonly secondaryButtonText?: string
	readonly secondaryButtonAction?: () => TResult | PromiseLike<TResult>
	readonly size?: DialogSize
	readonly blocking?: boolean
}

@component('mo-dialog-default')
export class DialogDefault<TResult = void> extends DialogComponent<Parameters<TResult>, TResult> {
	protected override get template() {
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

	protected override primaryButtonAction = () => this.parameters.primaryButtonAction?.() ?? super.primaryButtonAction()

	// eslint-disable-next-line @typescript-eslint/member-ordering
	protected override secondaryButtonAction = this.parameters.secondaryButtonAction?.bind(this)
}