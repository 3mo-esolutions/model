import { component, html, ifDefined } from '../../library'
import { DialogComponent } from '../../shell'
import { BaseDialogParameters } from './BaseDialogParameters'

type Parameters<TResult> = BaseDialogParameters & { readonly secondaryButtonText?: string } & {
	readonly primaryAction?: () => TResult | PromiseLike<TResult>
	readonly secondaryButtonText?: string
	readonly secondaryAction?: () => TResult | PromiseLike<TResult>
}

@component('mo-dialog-default')
export class DialogDefault<TResult = void> extends DialogComponent<Parameters<TResult>, TResult> {
	protected override get template() {
		return html`
			<mo-dialog
				heading=${this.parameters.heading}
				size=${ifDefined(this.parameters.size)}
				primaryButtonText=${this.parameters.primaryButtonText ?? _('OK')}
				secondaryButtonText=${this.parameters.secondaryButtonText ?? _('Cancel')}
				?blocking=${this.parameters.blocking}
				primaryOnEnter
			>
				${this.parameters.content}
			</mo-dialog>
		`
	}

	protected override primaryAction() {
		return this.parameters.primaryAction ? this.parameters.primaryAction() : super.primaryAction()
	}

	protected override secondaryAction() {
		return this.parameters.secondaryAction ? this.parameters.secondaryAction() : super.secondaryAction()
	}
}