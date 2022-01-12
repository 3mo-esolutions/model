import { component, html, property, renderContainer } from '../../../library'
import { FieldTextBase } from './FieldTextBase'
import { FieldInputMode } from '..'
import { Debouncer } from '../../..'

@component('mo-field-search')
export class FieldSearch extends FieldTextBase {
	@property({ reflect: true }) override inputMode: FieldInputMode = 'search'
	@property({ type: Number }) debounce = 500

	private readonly debouncer = new Debouncer()

	protected override async handleInput() {
		await this.debouncer.debounce(this.debounce)
		super.handleInput()
	}

	@renderContainer('slot[name="leading"]')
	protected get searchIconTemplate() {
		return html`
			<mo-icon icon='search' foreground=${this.active ? 'var(--mo-accent)' : ''}></mo-icon>
		`
	}

	@renderContainer('slot[name="trailing"]')
	protected get clearIconTemplate() {
		return html`
			<mo-icon-button icon='cancel' ?hidden=${!this.value} @click=${() => this.clear()}></mo-icon-button>
		`
	}

	protected clear() {
		if (!this.value) {
			return
		}
		this.value = ''
		this.requestUpdate()
		this.change.dispatch(this.value)
		this.input.dispatch(this.value)
		this.requestUpdate()
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-search': FieldSearch
	}
}