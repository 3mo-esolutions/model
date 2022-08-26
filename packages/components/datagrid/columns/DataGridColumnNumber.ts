import { component, html, ifDefined, style } from '../../../library'
import { DataGridColumnNumberBase } from '.'

@component('mo-data-grid-column-number')
export class DataGridColumnNumber<TData> extends DataGridColumnNumberBase<TData> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getContentTemplate(value: number | undefined, _data: TData) {
		return html`${Number.isFinite(value) ? value : ''}`
	}

	getEditContentTemplate(value: number | undefined, data: TData) {
		return html`
			<mo-field-number dense label=${this.heading}
				value=${ifDefined(value)}
				@change=${(e: CustomEvent<number>) => this.handleEdit(e.detail, data)}
			></mo-field-number>
		`
	}

	getSumTemplate(sum: number) {
		return html`<mo-div ${style({ color: 'var(--mo-accent)', textAlign: 'center', fontWeight: '500' })}>${sum}</mo-div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-column-number': DataGridColumnNumber<unknown>
	}
}