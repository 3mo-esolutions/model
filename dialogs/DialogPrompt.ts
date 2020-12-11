import { internalProperty, component, DialogComponent, html } from '../library'
import { TextField } from '../components'

@component('eb-dialog-input')
export default class DialogPrompt extends DialogComponent<{ header: string, text?: string, inputLabel?: string, primaryButtonText?: string, handler: (input: string) => void }> {
	@internalProperty() private input = ''

	protected render = () => html`
		<mo-dialog
			header=${this.parameters.header ?? 'Prompt'}
			primaryButtonText=${this.parameters.primaryButtonText ?? 'Übernehmen'}
			.primaryButtonClicked=${this.handle.bind(this)}
		>
			<style>
				p:empty {
					display: none;
				}
			</style>

			<mo-flex width='100%' height='100%'>
				<p>${this.parameters.text ?? ''}</p>
				<mo-text-field
					label=${this.parameters.inputLabel ?? 'Input'}
					value=${this.input}
					@input=${(e: CustomEvent<undefined, TextField>) => this.input = e.source.value}
				></mo-text-field>
			</mo-flex>
		</mo-dialog>
	`

	protected handle() {
		this.parameters.handler(this.input)
	}
}