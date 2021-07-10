import { state, component, DialogComponent, html } from '../../library'

@component('eb-dialog-prompt')
export class DialogPrompt extends DialogComponent<{ header: string, value?: string, text?: string, inputLabel?: string, primaryButtonText?: string }, string> {
	@state() private input = this.parameters.value ?? ''

	protected override render = () => html`
		<mo-dialog
			header=${this.parameters.header}
			primaryButtonText=${this.parameters.primaryButtonText ?? 'Übernehmen'}
		>
			<style>
				p:empty {
					display: none;
				}
			</style>

			<mo-flex width='100%' height='100%'>
				<p>${this.parameters.text ?? ''}</p>
				<mo-field-text
					label=${this.parameters.inputLabel ?? 'Input'}
					value=${this.input}
					@input=${(e: CustomEvent<string>) => this.input = e.detail}
				></mo-field-text>
			</mo-flex>
		</mo-dialog>
	`

	protected override primaryButtonAction = () => this.input
}