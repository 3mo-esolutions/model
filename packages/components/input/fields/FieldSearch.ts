import { component, html, nothing, style } from '@a11d/lit'
import { FieldTextBase } from './FieldTextBase'

@component('mo-field-search')
export class FieldSearch extends FieldTextBase {
	override readonly inputMode = 'search'

	protected override get template() {
		return html`
			<mo-icon icon='search' ${style({ color: this.active ? 'var(--mo-color-accent)' : 'var(--mo-color-gray)' })}></mo-icon>
			${super.template}
			${!this.value ? nothing : html`
				<mo-icon-button icon='cancel' dense ${style({ color: 'var(--mo-color-gray)' })} @click=${() => this.clear()}></mo-icon-button>
			`}
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