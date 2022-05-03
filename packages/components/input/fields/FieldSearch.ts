import { component, html, renderContainer } from '../../../library'
import { FieldTextBase } from './FieldTextBase'

@component('mo-field-search')
export class FieldSearch extends FieldTextBase {
	override readonly inputMode = 'search'

	@renderContainer('slot[name="leading"]')
	protected get searchIconTemplate() {
		return html`
			<mo-icon icon='search' foreground=${this.active ? 'var(--mo-accent)' : ''}></mo-icon>
		`
	}

	@renderContainer('slot[name="trailingInternal"]')
	protected get clearIconTemplate() {
		return html`
			<mo-icon-button icon='cancel' small ?hidden=${!this.value} @click=${() => this.clear()}></mo-icon-button>
		`
	}

	protected clear() {
		if (this.inputElement.value) {
			this.inputElement.value = ''
			this.handleInput()
			this.handleChange()
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-search': FieldSearch
	}
}