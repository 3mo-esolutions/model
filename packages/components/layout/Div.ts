import { component, html, Component } from '../../library'

@component('mo-div')
export class Div extends Component {
	protected override get template() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-div': Div
	}
}