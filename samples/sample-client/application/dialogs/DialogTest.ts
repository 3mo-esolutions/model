import { component, html, DialogComponent, state } from '@3mo/model'

@component('mo-dialog-test')
export class DialogTest extends DialogComponent<void, string> {
	@state() name = 'Test'

	protected override async initialized() {
		await Promise.sleep(1000)
		// this.name = 'Arshia'
	}

	protected override get template() {
		return html`
			<mo-dialog heading='Test' poppable>
				<mo-field-text label='name'
					value=${this.name}
					@change=${(e: CustomEvent<string>) => this.name = e.detail}
				></mo-field-text>
			</mo-dialog>
		`
	}

	protected override primaryButtonAction() {
		return this.name
	}
}