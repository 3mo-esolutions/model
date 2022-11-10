import { Component, component, html, property } from '@a11d/lit'
import { Field } from './Field'

export const enum FieldPairMode {
	Attach = 'attach',
	Overlay = 'overlay',
}

@component('mo-field-pair')
export class FieldPair<TField extends Field<unknown>, TFieldAttachment extends Field<unknown>> extends Component {
	@property({ reflect: true }) mode = FieldPairMode.Attach

	get fieldElement() { return this.children[0] as TField }
	get fieldAttachmentElement() { return this.children[1] as TFieldAttachment }

	protected override get template() {
		return html`
			<style>
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
					right: 0;
					top: 0;
				}

				::slotted(:not([slot])) {
					width: 100%;
					height: 100%;
					--mo-field-border-top-right-radius: 0px;
				}

				::slotted([slot=attachment]) {
					height: 100%;
					align-items: center;
					--mo-field-border-top-left-radius: 0px;
				}
			</style>

			<slot></slot>

			<div>
				<slot name='attachment'></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-pair': FieldPair<any, any>
	}
}