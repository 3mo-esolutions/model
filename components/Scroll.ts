import { component, html, Component } from '../library'

@component('mdc-scroll')
export default class Scroll extends Component {
	protected render() {
		return html`
			<style>
				:host {
					overflow: auto;
					min-height: 0;
					display: block;
					position: relative;
					width: 100%;
					height: 100%;
					scrollbar-color: var(--mdc-scrollbar-foreground-color) var(--mdc-scrollbar-background-color);
					scrollbar-width: thin;
				}

				:host::-webkit-scrollbar {
					width: 5px;
					height: 5px;
				}

				:host::-webkit-scrollbar-thumb {
					background: var(--mdc-scrollbar-foreground-color);
				}

				div {
					position: absolute;
					width: 100%;
					height: 100%;
				}
			</style>
			<div>
				<slot></slot>
			</div>
		`
	}
}