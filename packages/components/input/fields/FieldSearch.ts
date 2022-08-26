import { component, html, style } from '../../../library'
import { FieldTextBase } from './FieldTextBase'

@component('mo-field-search')
export class FieldSearch extends FieldTextBase {
	override readonly inputMode = 'search'

	protected override get template() {
		return html`
			<mo-icon icon='search' ${style({ color: this.active ? 'var(--mo-accent)' : 'var(--mo-color-gray)' })}></mo-icon>
			${super.template}
			<mo-icon-button icon='cancel' small ${style({ color: 'var(--mo-color-gray)' })}
				?hidden=${!this.value} @click=${() => this.clear()}
			></mo-icon-button>
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