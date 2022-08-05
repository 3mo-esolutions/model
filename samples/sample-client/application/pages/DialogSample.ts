import { DialogComponent, html } from "@3mo/model"
import { component } from "@a11d/lit"

@component('dialasdadsa-asdasd')
export class DialogSample extends DialogComponent {
	protected override get template() {
		return html`
			<mo-dialog heading='Dialog Sample'>
				<mo-flex height='100%' alignItems='center' justifyContent='center' gap='var(--mo-thickness-xl)'>
					<mo-heading foreground='var(--mo-accent)'>Welcome to 3MO Design Library</mo-heading>
					<mo-div>As always there is a counter in a sample project. Get used to it 😀</mo-div>
				</mo-flex>
			</mo-dialog>
		`
	}
}