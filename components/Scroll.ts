import { component, html, Component } from '../library'

@component('mo-scroll')
export default class Scroll extends Component {
	protected render() {
		return html`
			<style>
				:host {
					/* 'overlay' is not supported in firefox so it fallbacks to auto, otherwise overlay is set */
					overflow: auto;
					overflow: overlay;
					min-height: 0;
					display: block;
					position: relative;
					width: 100%;
					height: 100%;
					scrollbar-color: var(--mo-scrollbar-foreground-color) var(--mo-scrollbar-background-color);
					scrollbar-width: thin;
				}

				:host::-webkit-scrollbar {
					width: 5px;
					height: 5px;
				}

				:host::-webkit-scrollbar-thumb {
					background: var(--mo-scrollbar-foreground-color);
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

declare global {
	interface HTMLElementTagNameMap {
		'mo-scroll': Scroll
	}
}