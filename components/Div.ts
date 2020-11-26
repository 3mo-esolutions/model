import { component, html, Component } from '../library'

@component('mdc-div')
export default class Div extends Component {
	protected render() {
		return html`<slot></slot>`
	}
}