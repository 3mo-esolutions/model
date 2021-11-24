import { state, component, html } from '../../library'
import { DialogComponent } from '..'
import { BaseDialogParameters } from './BaseDialogParameters'

type Parameters = BaseDialogParameters & {
	readonly inputLabel?: string
	readonly value?: string
}

@component('mo-dialog-prompt')
export class DialogPrompt extends DialogComponent<Parameters, string> {
	@state() private value = this.parameters.value ?? ''

	protected override get template() {
		return html`
			<mo-dialog
				heading=${this.parameters.heading}
				primaryButtonText=${this.parameters.primaryButtonText ?? 'Übernehmen'}
				?blocking=${this.parameters.blocking}
				primaryOnEnter
			>
				<mo-flex width='100%' height='100%' gap='var(--mo-thickness-m)'>
					${this.parameters.content}

					<mo-field-text label=${this.parameters.inputLabel ?? 'Input'}
						value=${this.value}
						@input=${(e: CustomEvent<string>) => this.value = e.detail}
					></mo-field-text>
				</mo-flex>
			</mo-dialog>
		`
	}

	protected override primaryButtonAction = () => this.value
}