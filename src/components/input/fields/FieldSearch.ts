import { component, html, property, renderContainer } from '../../../library'
import { FieldTextBase } from './FieldTextBase'

@component('mo-field-search')
export class FieldSearch extends FieldTextBase {
	@property({ type: Number }) debounce = 500

	private timerId = -1

	protected override initialized() {
		super.initialized()
	}

	protected override registerInputEventListener() {
		this.inputElement.addEventListener('input', this.inputEventHandler)
	}

	private readonly inputEventHandler = (e: Event) => {
		e.stopPropagation()
		window.clearTimeout(this.timerId)
		this.timerId = window.setTimeout(() => this.input.dispatch(this.toValue(this.inputElement.value)), this.debounce)
		return
	}

	@renderContainer('slot[name="leading"]')
	protected get searchIconTemplate() {
		return html`
			<mo-icon icon='search' foreground=${this.active ? 'var(--mo-accent)' : ''}></mo-icon>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-search': FieldSearch
	}
}