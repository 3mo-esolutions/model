import { component, css, html, Component } from '../../library'

@component('mo-scroll')
export class Scroll extends Component {
	static override get styles() {
		return css`
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
				width: var(--mo-scroll-width, 100%);
				height: 100%;
			}
		`
	}

	protected override get template() {
		return html`
			<div part='container'>
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