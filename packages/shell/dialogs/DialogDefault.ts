import { component, html, ifDefined } from '../../library'
import { DialogComponent } from '..'
import { BaseDialogParameters } from './BaseDialogParameters'

type Parameters<TResult> = BaseDialogParameters & { readonly secondaryButtonText?: string } & {
	readonly primaryButtonAction?: () => TResult | PromiseLike<TResult>
	readonly secondaryButtonText?: string
	readonly secondaryButtonAction?: () => TResult | PromiseLike<TResult>
}

@component('mo-dialog-default')
export class DialogDefault<TResult = void> extends DialogComponent<Parameters<TResult>, TResult> {
	protected override get template() {
		return html`
			<mo-dialog
				heading=${this.parameters.heading}
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

	protected override primaryButtonAction() {
		return this.parameters.primaryButtonAction ? this.parameters.primaryButtonAction() : super.primaryButtonAction()
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	protected override secondaryButtonAction = this.parameters.secondaryButtonAction?.bind(this)
}