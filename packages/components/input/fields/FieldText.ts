import { component, html, nothing, property, style } from '@a11d/lit'
import { FieldTextBase } from './FieldTextBase'

@component('mo-field-text')
export class FieldText extends FieldTextBase {
	@property({ type: Number, reflect: true }) override minLength?: number
	@property({ type: Number, reflect: true }) override maxLength?: number

	protected override get template() {
		return html`
			${super.template}
			${this.lengthTemplate}
		`
	}

	private get lengthTemplate() {
		if (!this.maxLength) {
			return nothing
		}
		const remainingLength = this.maxLength - this.fromValue(this.value).length
		return html`
			<div @click=${() => this.focus()} ${style({ color: 'var(--mo-color-gray-transparent)' })}>${remainingLength}</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-text': FieldText
	}
}