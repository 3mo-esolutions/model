import { component, html, Component } from '../library'

@component('mo-div')
export class Div extends Component {
	protected render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-div': Div
	}
}