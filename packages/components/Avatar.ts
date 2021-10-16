import { html, component, Component, css } from '../../library'

@component('mo-avatar')
export class Avatar extends Component {
	static override get styles() {
		return css`
			:host {
				height: 40px;
				width: 40px;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				font-size: var(--mo-font-size-l);
				color: var(--mo-color-accessible);
				background: var(--mo-accent);
			}
		`
	}

	protected override get template() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-avatar': Avatar
	}
}