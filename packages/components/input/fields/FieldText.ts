import { component, html, nothing, property, renderContainer } from '../../../library'
import { FieldTextBase } from './FieldTextBase'

/**
 * @fires input {CustomEvent<string>}
 */
@component('mo-field-text')
export class FieldText extends FieldTextBase {
	@property({ type: Number, reflect: true, observer: counterChanged }) counter?: number

	@renderContainer('slot[name="trailingInternal"]')
	protected get counterTemplate() {
		return !this.counter ? nothing : html`
			<mo-div>${this.remainingLength}</mo-div>
		`
	}

	private get remainingLength() {
		return !this.counter ? undefined : this.counter - this.fromValue(this.value).length
	}
}

function counterChanged(this: FieldText) {
	if (!this.counter) {
		return
	}

	this.inputElement.maxLength = this.counter
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-text': FieldText
	}
}