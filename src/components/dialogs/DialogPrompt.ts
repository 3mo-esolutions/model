import { state, component, DialogComponent, html } from '../../library'

@component('eb-dialog-input')
export class DialogPrompt extends DialogComponent<{ header: string, value?: string, text?: string, inputLabel?: string, primaryButtonText?: string, handler: (input: string) => void }> {
	@state() private input = this.parameters.value ?? ''

	protected render = () => html`
		<mo-dialog
			header=${this.parameters.header ?? 'Prompt'}
			primaryButtonText=${this.parameters.primaryButtonText ?? 'Übernehmen'}
			.primaryButtonClicked=${this.handle}
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
					@input=${(e: CustomEvent<string>) => this.input = e.detail ?? ''}
				></mo-field-text>
			</mo-flex>
		</mo-dialog>
	`

	protected handle = () => {
		this.parameters.handler(this.input)
	}
}