import { component, Component, css, html } from '@a11d/lit'

@component('mo-line')
export class SeparatorLine extends Component {
	static override get styles() {
		return css`
			:host {
				display: block;
			}

			div {
				display: flex;
				align-items: center;
				text-align: center;
			}

			div::before,
			div::after {
				content: '';
				flex: 1;
				border-bottom: 1px solid var(--mo-color-transparent-gray-3);
			}

			:host(:not(:empty)) div::before {
				margin-right: .25em;
			}

			:host(:not(:empty)) div::after {
				margin-left: .25em;
			}
		`
	}

	protected override get template() {
		return html`
			<div>
				<slot></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-line': SeparatorLine
	}
}