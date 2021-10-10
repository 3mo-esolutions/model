import { component, html, property, renderContainer } from '../../../library'
import { FieldTextBase } from './FieldTextBase'
import { FieldInputMode } from '..'

@component('mo-field-search')
export class FieldSearch extends FieldTextBase {
	@property({ reflect: true }) override inputMode: FieldInputMode = 'search'
	@property({ type: Number }) debounce = 500

	protected override async handleInput() {
		await this.enqueueDebounce()
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

	protected async clear() {
		if (!this.value) {
			return
		}
		this.value = ''
		this.requestUpdate()
		await this.enqueueDebounce()
		this.change.dispatch(this.value)
		this.input.dispatch(this.value)
		this.requestUpdate()
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	private timerId = -1
	private enqueueDebounce() {
		return new Promise<void>(resolve => {
			window.clearTimeout(this.timerId)
			this.timerId = window.setTimeout(() => resolve(), this.debounce)
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-search': FieldSearch
	}
}