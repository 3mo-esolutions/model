import { Component, component, css, html, property } from '@a11d/lit'

export const enum FieldPairMode {
	Attach = 'attach',
	Overlay = 'overlay',
}

@component('mo-field-pair')
export class FieldPair extends Component {
	@property({ reflect: true }) mode = FieldPairMode.Attach

	static override get styles() {
		return css`
			:host {
				position: relative;
				display: grid;
				grid-template-columns: 1fr var(--mo-field-pair-attachment-width, 100px);
			}

			:host([mode=overlay]) {
				display: block;
			}

			div {
				width: var(--mo-field-pair-attachment-width, 100px);
				background: var(--mdc-text-field-fill-color);
			}

			:host([mode=overlay]) div {
				height: auto;
				position: absolute;
				inset-inline-end: 0;
				top: 0;
			}

			::slotted(:not([slot])) {
				width: 100%;
				height: 100%;
				--mo-field-border-start-end-radius: 0px;
			}

			::slotted([slot=attachment]) {
				height: 100%;
				align-items: center;
				--mo-field-border-start-start--radius: 0px;
			}
		`
	}

	protected override get template() {
		return html`
			<slot></slot>
			<div>
				<slot name='attachment'></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-pair': FieldPair
	}
}