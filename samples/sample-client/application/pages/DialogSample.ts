import { DialogComponent, html } from '@3mo/model'
import { component, style } from '@a11d/lit'

@component('dialasdadsa-asdasd')
export class DialogSample extends DialogComponent {
	protected override get template() {
		return html`
			<mo-dialog heading='Dialog Sample'>
				<mo-flex alignItems='center' justifyContent='center' gap='var(--mo-thickness-xl)' ${style({ height: '100%' })}>
					<mo-heading ${style({ color: 'var(--mo-color-accent)' })}>Welcome to 3MO Design Library</mo-heading>
					<div>As always there is a counter in a sample project. Get used to it 😀</div>
				</mo-flex>
			</mo-dialog>
		`
	}
}