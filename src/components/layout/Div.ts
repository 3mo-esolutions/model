import { component, html, Component } from '../../library'

@component('mo-div')
export class Div extends Component {
	protected override render = () => html`<slot></slot>`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-div': Div
	}
}